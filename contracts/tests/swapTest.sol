// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Swap} from "../utils/swap.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Test harness for the Swap mixin. TEST CONTRACT ONLY — never
 *      deployed to production networks.
 *
 * V0.9 changes:
 *  - _swap now takes an absolute minAmountOut instead of slippage bps;
 *    every external helper exposes that parameter so tests drive it.
 *  - receive()/fallback() no longer console.log: WETH9.withdraw sends
 *    ETH with the 2300-gas stipend, and console.log costs more than
 *    that — the logging itself made every ETH-receiving test revert.
 *  - quoteSwap exposes _getQuote so tests can derive a sane floor.
 */
contract SwapTest is Swap {
    constructor(address swapRouterAddress, address quoterAddress) Swap(swapRouterAddress, quoterAddress) {}

    fallback() external payable {}

    receive() external payable {}

    function swapTokensInContract(
        address baseTokenAddress,
        address targetTokenAddress,
        uint256 amount,
        uint256 minAmountOut
    ) external returns (uint256) {
        return _swap(baseTokenAddress, targetTokenAddress, amount, minAmountOut);
    }

    function swapToEthInContract(
        address baseTokenAddress,
        uint256 amount,
        uint256 minAmountOut
    ) external returns (uint256) {
        return _swap(baseTokenAddress, address(0), amount, minAmountOut);
    }

    function swapTokensToTarget(
        address baseTokenAddress,
        address targetTokenAddress,
        uint256 amount,
        address recipient,
        uint256 minAmountOut
    ) external returns (uint256 amountReturned) {
        amountReturned = _swap(baseTokenAddress, targetTokenAddress, amount, minAmountOut);
        IERC20(targetTokenAddress).transfer(recipient, amountReturned);
        return amountReturned;
    }

    function swapTokensToEthToTarget(
        address baseTokenAddress,
        uint256 amount,
        address recipient,
        uint256 minAmountOut
    ) external returns (uint256 amountReturned) {
        amountReturned = _swap(baseTokenAddress, address(0), amount, minAmountOut);
        // call{value} rather than .transfer — recipient may be a
        // contract needing more than the 2300-gas stipend.
        (bool ok, ) = payable(recipient).call{value: amountReturned}("");
        require(ok, "SwapTest: ETH forward failed");
        return amountReturned;
    }

    function quoteSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256) {
        return _getQuote(tokenIn, tokenOut, amountIn, DEFAULT_POOL_FEE);
    }

    function setAllowance(address tokenAddress, uint256 amount) external {
        _approveSwapSpend(tokenAddress, amount);
    }

    function withdrawETH(uint256 amount) external {
        _withdrawWETH(amount);
    }
}
