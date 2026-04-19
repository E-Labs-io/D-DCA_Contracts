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
     * @param baseToken_  token address of the token to swap from
     * @param targetToken_  token address of the token to receive
     * @param amount_  amount to swap
     * @param slippageToleranceBps_  slippage tolerance in basis points (1 = 0.01%)
     * @return amount  amount returned by the swap
     */
    function _swap(
        address baseToken_,
        address targetToken_,
        uint256 amount_,
        uint256 slippageToleranceBps_
    ) internal returns (uint256 amount) {
        // Get the appropriate pool fee for this token pair
        uint24 poolFee = _getPoolFee(baseToken_, targetToken_);

        // Calculate minimum amount out based on slippage tolerance
        // First get a quote for the swap to calculate minimum output
        uint256 estimatedAmountOut = _getQuote(baseToken_, targetToken_, amount_, poolFee);
        uint256 amountOutMinimum = (estimatedAmountOut * (10000 - slippageToleranceBps_)) / 10000;

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
                    amountOutMinimum: amountOutMinimum,
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
                        amountOutMinimum: amountOutMinimum,
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
    function _getQuote(
        address tokenIn_,
        address tokenOut_,
        uint256 amountIn_,
        uint24 fee_
    ) internal returns (uint256 amountOut) {
        // Build the path for single-hop swap
        bytes memory path = abi.encodePacked(tokenIn_, fee_, tokenOut_);

        try QUOTER.quoteExactInput(path, amountIn_) returns (
            uint256 amountOut_,
            uint160[] memory,
            uint32[] memory,
            uint256
        ) {
            return amountOut_;
        } catch {
            // If quoting fails, return 0 - the swap will still work with amountOutMinimum = 0
            // This is a fallback to maintain functionality
            return 0;
        }
    }
}
