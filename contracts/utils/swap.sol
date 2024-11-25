// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";

//import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
//import "@uniswap/v3-periphery/contracts/interfaces/external/IWETH9.sol";

import {ISwapRouter, IWETH9} from "../protocols/uniswap/ISwapRouterv3.sol";

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
    uint24 private _poolFee = 3000;

    constructor(address swapAddress) {
        SWAP_ROUTER = ISwapRouter(swapAddress);
    }

    /**
     * @dev swaps from base token for set amount into any amount of target token
     * @param baseToken_  token address of the token to swap from
     * @param targetToken_  token address of the token to receive
     * @param amount_  amount to swap
     * @return amount  amount returned by the swap
     */
    function _swap(
        address baseToken_,
        address targetToken_,
        uint256 amount_
    ) internal returns (uint256 amount) {
        //  The call to `exactInputSingle` executes the swap.
        if (targetToken_ == address(0)) {
            // Swap tokens for WETH then convert to ETH
            amount = SWAP_ROUTER.exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: baseToken_,
                    tokenOut: SWAP_ROUTER.WETH9(),
                    fee: _poolFee,
                    recipient: address(this),
                    amountIn: amount_,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            );

            IWETH9(SWAP_ROUTER.WETH9()).withdraw(amount);

            return amount;
        } else
            return
                SWAP_ROUTER.exactInputSingle(
                    ISwapRouter.ExactInputSingleParams({
                        tokenIn: baseToken_,
                        tokenOut: targetToken_,
                        fee: _poolFee,
                        recipient: address(this),
                        amountIn: amount_,
                        amountOutMinimum: 0,
                        sqrtPriceLimitX96: 0
                    })
                );
    }

    /**
     * @dev logic to approve external address to spend given token
     * @param baseToken_ address of the base token to allow contract to spend
     * @param amount_ amount to limit the spend
     */
    function _approveSwapSpend(
        address baseToken_,
        uint256 amount_
    ) internal returns (bool success) {
        success = _checkSendAllowance(
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
     */
    function _checkSendAllowance(
        address baseToken_,
        address spender_,
        uint256 neededAllowance_
    ) internal view returns (bool) {
        return
            IERC20(baseToken_).allowance(address(this), spender_) >=
            neededAllowance_;
    }

    function _updateSwapAddress(address newSwapRouter_) internal {
        SWAP_ROUTER = ISwapRouter(newSwapRouter_);
    }
}
