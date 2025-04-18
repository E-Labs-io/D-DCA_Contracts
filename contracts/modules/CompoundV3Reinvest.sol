// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../protocols/compoundV3/CometMainInterface.sol";
import {ReinvestCodes} from "../library/Codes.sol";

import "hardhat/console.sol";
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
library CompoundV3Reinvest {
    string public constant MODULE_NAME = "Compound V3 Reinvest";
    uint8 public constant MODULE_ID = 0x11;

    address internal constant COMPOUND_ETH_CONTRACT =
        0x46e6b214b524310239732D51387075E0e70970bf; //ETH Base
    address internal constant COMPOUND_USDC_CONTRACT =
        0xb125E6687d4313864e53df431d5425969c15Eb2F; //USDC Base

    uint8 constant WETH = 0x0;
    uint8 constant USDC = 0x1;
    struct ReinvestDataStruct {
        uint8 moduleCode;
        address receiver;
        address token;
    }

    function _execute(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);

        amount = _supplyCompound(
            investData.moduleCode,
            amount_,
            investData.token
        );

        if (amount > 0) success = true;

        return (amount, success);
    }

    function _unwind(
        uint256 amount_,
        bytes memory data_
    ) internal returns (uint256 amount, bool success) {
        ReinvestDataStruct memory investData = _decodeData(data_);

        amount = _withdrawCompound(
            investData.moduleCode,
            amount_,
            investData.token
        );

        if (amount > 0) success = true;

        return (amount, success);
    }

    function _supplyCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        address compoundContract = _getContractAddress(code_);
        uint256 oldBalance = _getBalance(compoundContract);

        bool allowed = IERC20(tokenAddress_).approve(compoundContract, amount_);
        require(allowed, "DCAAccount : [Compound Reinvest] - Approval failed");

        CometMainInterface(compoundContract).supply(tokenAddress_, amount_);

        uint256 newBalance = _getBalance(compoundContract);

        amount = newBalance - oldBalance;

        return amount;
    }

    function _withdrawCompound(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {
        address compoundContract = _getContractAddress(code_);
        uint256 oldBalance = _getBalance(compoundContract);

        CometMainInterface(compoundContract).withdraw(tokenAddress_, amount_);
        amount = oldBalance - (_getBalance(compoundContract));
        return (amount);
    }

    function _getContractAddress(uint8 code_) internal pure returns (address) {
        if (code_ == WETH) return COMPOUND_ETH_CONTRACT;
        if (code_ == USDC) return COMPOUND_USDC_CONTRACT;
    }

    function _getBalance(address pool_) internal view returns (uint256 amount) {
        amount = CometMainInterface(pool_).balanceOf(address(this));
    }

    function _withdrawReward(
        uint8 code_,
        uint256 amount_,
        address tokenAddress_
    ) internal returns (uint256 amount) {}

    function _decodeData(
        bytes memory data_
    ) private pure returns (ReinvestDataStruct memory) {
        return abi.decode(data_, (ReinvestDataStruct));
    }
}
