// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Swap} from "../utils/swap.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract SwapTest is Swap {
    constructor(address swapAddress) Swap(swapAddress) {}

    /**
     * @dev Fallback function for the DCAExecutor contract
     */
    fallback() external payable {
        console.log("SwapTest : [fallback]", msg.value);
    }

    receive() external payable {
        console.log("SwapTest : [receive]", msg.value);
    }

    function swapTokensInContract(
        address baseTokenAddress,
        address targetTokenAddress,
        uint256 amount
    ) external returns (uint256) {
        return _swap(baseTokenAddress, targetTokenAddress, amount);
    }

    function swapToEthInContract(
        address baseTokenAddress,
        uint256 amount
    ) external returns (uint256) {
        return _swap(baseTokenAddress, address(0), amount);
    }

    function swapTokensToTarget(
        address baseTokenAddress,
        address targetTokenAddress,
        uint256 amount,
        address recipient
    ) external returns (uint256 amountReturned) {
        amountReturned = _swap(baseTokenAddress, targetTokenAddress, amount);
        IERC20(targetTokenAddress).transfer(recipient, amountReturned);
        return amountReturned;
    }

    function swapTokensToEthToTarget(
        address baseTokenAddress,
        uint256 amount,
        address recipient
    ) external returns (uint256 amountReturned) {
        amountReturned = _swap(baseTokenAddress, address(0), amount);
        payable(recipient).transfer(amountReturned);
        return amountReturned;
    }

    function setAllowance(address tokenAddress, uint256 amount) external {
        _approveSwapSpend(tokenAddress, amount);
    }

    function withdrawETH(uint256 amount) external {
        _withdrawWETH(amount);
    }
}
