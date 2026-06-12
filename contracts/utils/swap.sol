// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISwapRouter, IWETH9} from "../protocols/uniswap/ISwapRouterv3.sol";
import {IQuoterV2} from "../protocols/uniswap/IQuoterV2.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
/**
 *
 ************************************************
 *____ooo____oooooooo_oooo____oooo____ooo____oo_*
 *__oo___oo_____oo_____oo___oo____oo__oooo___oo_*
 *_oo_____oo____oo_____oo__oo______oo_oo_oo__oo_*
 *_ooooooooo____oo_____oo__oo______oo_oo__oo_oo_*
 *_oo_____oo____oo_____oo___oo____oo__oo___oooo_*
 *_oo_____oo____oo____oooo____oooo____oo____ooo_*
 *______________________________________________*
 *       Dollar Cost Average Contracts
 ************************************************
 *                  V0.6
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */
abstract contract Swap {
    /// @notice Thrown when a swap is attempted without an explicit
    ///         minimum-output floor. A zero floor means unlimited
    ///         slippage — never acceptable for user funds.
    error NoMinimumOut();

    ISwapRouter public SWAP_ROUTER;
    IQuoterV2 public QUOTER;

    // Default pool fee - can be overridden by getPoolFee function
    uint24 public constant DEFAULT_POOL_FEE = 3000;

    constructor(address swapRouterAddress, address quoterAddress) {
        SWAP_ROUTER = ISwapRouter(swapRouterAddress);
        QUOTER = IQuoterV2(quoterAddress);
    }

    /**
     * @dev swaps from base token for set amount into any amount of target token
     * @notice Slippage model (V0.9): the caller supplies an ABSOLUTE
     *  minimum-output amount computed off-chain against a fair market
     *  price. The previous design derived the floor from a same-block
     *  on-chain quote, which tracks a sandwich attacker's pool
     *  manipulation and silently fell back to 0 when quoting failed —
     *  i.e. it protected nothing precisely when protection mattered.
     *  A zero floor now reverts rather than executing unprotected.
     * @param baseToken_  token address of the token to swap from
     * @param targetToken_  token address of the token to receive (address(0) = native ETH via WETH unwrap)
     * @param amount_  amount to swap
     * @param minAmountOut_  absolute minimum acceptable output (in target-token units; WETH units for ETH)
     * @return amount  amount returned by the swap
     */
    function _swap(
        address baseToken_,
        address targetToken_,
        uint256 amount_,
        uint256 minAmountOut_
    ) internal returns (uint256 amount) {
        if (minAmountOut_ == 0) revert NoMinimumOut();

        // Get the appropriate pool fee for this token pair
        uint24 poolFee = _getPoolFee(baseToken_, targetToken_);

        // The call to `exactInputSingle` executes the swap.
        if (targetToken_ == address(0)) {
            // Swap tokens for WETH then convert to ETH
            amount = SWAP_ROUTER.exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: baseToken_,
                    tokenOut: SWAP_ROUTER.WETH9(),
                    fee: poolFee,
                    recipient: address(this),
                    amountIn: amount_,
                    amountOutMinimum: minAmountOut_,
                    sqrtPriceLimitX96: 0
                })
            );
            _withdrawWETH(amount);
            return amount;
        } else
            return
                SWAP_ROUTER.exactInputSingle(
                    ISwapRouter.ExactInputSingleParams({
                        tokenIn: baseToken_,
                        tokenOut: targetToken_,
                        fee: poolFee,
                        recipient: address(this),
                        amountIn: amount_,
                        amountOutMinimum: minAmountOut_,
                        sqrtPriceLimitX96: 0
                    })
                );
    }

    /**
     * @dev logic to approve external address to spend given token
     * @param baseToken_ address of the base token to allow contract to spend
     * @param amount_ amount to limit the spend
     * @return success The success of the approval
     */
    function _approveSwapSpend(
        address baseToken_,
        uint256 amount_
    ) internal returns (bool success) {
        success = _checkSpendAllowance(
            baseToken_,
            address(SWAP_ROUTER),
            amount_
        );
        if (!success) {
            success = IERC20(baseToken_).approve(address(SWAP_ROUTER), amount_);
            require(success, "Swap Allowance Set Failed");
        }
    }

    /**
     * @dev Check if the spender has enough spend to execute
     * @param baseToken_ Address of the base token to check allowance of
     * @param spender_ address of the spending contract
     * @param neededAllowance_ amount of the base token the allowance
     * @return If the allowance is enough
     */
    function _checkSpendAllowance(
        address baseToken_,
        address spender_,
        uint256 neededAllowance_
    ) internal view returns (bool) {
        return
            IERC20(baseToken_).allowance(address(this), spender_) >=
            neededAllowance_;
    }

    /**
     * @dev Updates the swap router address
     * @param newSwapRouter_ The new swap router address
     */
    function _updateSwapAddress(address newSwapRouter_) internal {
        SWAP_ROUTER = ISwapRouter(newSwapRouter_);
    }

    /**
     * @dev Withdraws ETH from the swap router
     * @param amount_ The amount of ETH to withdraw
     */
    function _withdrawWETH(uint256 amount_) internal {
        IWETH9(SWAP_ROUTER.WETH9()).withdraw(amount_);
    }

    /**
     * @dev Gets the optimal pool fee for a token pair
     * @param tokenIn_ Input token address
     * @param tokenOut_ Output token address
     * @return fee The pool fee to use (500, 3000, or 10000)
     */
    function _getPoolFee(
        address tokenIn_,
        address tokenOut_
    ) internal pure returns (uint24) {
        // For now, use default fee. In production, this could be enhanced to:
        // - Check pool liquidity for each fee tier
        // - Use historical data to determine optimal fee
        // - Consider token volatility
        return DEFAULT_POOL_FEE;
    }

    /**
     * @dev Gets a quote for the swap amount
     * @param tokenIn_ Input token address
     * @param tokenOut_ Output token address
     * @param amountIn_ Input amount
     * @param fee_ Pool fee
     * @return amountOut Estimated output amount
     */
    /// @notice Thrown when an on-chain quote cannot be obtained.
    error QuoteFailed(address tokenIn, address tokenOut, uint256 amountIn);

    function _getQuote(
        address tokenIn_,
        address tokenOut_,
        uint256 amountIn_,
        uint24 fee_
    ) internal returns (uint256 amountOut) {
        // address(0) means native ETH — the actual swap routes through
        // WETH, so the quote must too. (Previously this path encoded
        // address(0) directly, which always reverted in the quoter.)
        address quoteOut = tokenOut_ == address(0)
            ? SWAP_ROUTER.WETH9()
            : tokenOut_;

        // Build the path for single-hop swap
        bytes memory path = abi.encodePacked(tokenIn_, fee_, quoteOut);

        try QUOTER.quoteExactInput(path, amountIn_) returns (
            uint256 amountOut_,
            uint160[] memory,
            uint32[] memory,
            uint256
        ) {
            return amountOut_;
        } catch {
            // V0.9: a failed quote REVERTS instead of returning 0.
            // The old 0-fallback flowed into amountOutMinimum = 0 —
            // unlimited slippage masked as "maintaining functionality".
            // NOTE: no longer used in the execution hot path (callers
            // supply minAmountOut_ directly); retained for estimation.
            revert QuoteFailed(tokenIn_, tokenOut_, amountIn_);
        }
    }
}
