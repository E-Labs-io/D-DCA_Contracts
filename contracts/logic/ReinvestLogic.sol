// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
import "../library/Codes.sol";

import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";

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
 *    Decentralised Cost Average Contracts
 ************************************************
 *                  V0.6
 *  ation.capital
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */

abstract contract DCAReinvestLogic {
    using ReinvestCodes for uint8;
    string public constant REINVEST_VERSION = "TEST V0.5";
    bytes public constant ACTIVE_REINVESTS =
        abi.encodePacked(ReinvestCodes.FORWARD, ReinvestCodes.AAVE);

    /**
     *
     * @param reinvestData_ {Reinvest} Data of the reinvest strategy
     * @param amount_ {uint256} amount of the token to be invested
     * @return amount {uint256} the amount of the yield baring token recived
     */

    function _executeInvest(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        uint8 code = reinvestData_.investCode;

        if (code.checkCode(ReinvestCodes.NOT_ACTIVE)) return (amount, success);
        else if (code.checkCode(ReinvestCodes.FORWARD))
            return
                ForwardReinvest._execute(amount_, reinvestData_.reinvestData);
        else if (code.checkCode(ReinvestCodes.COMPOUND)) {} else if (
            code == ReinvestCodes.AAVE
        ) return AaveV3Reinvest._execute(amount_, reinvestData_.reinvestData);
    }

    function _executeWithdraw(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (reinvestData_.investCode <= ReinvestCodes.COMPOUND) {} else if (
            reinvestData_.investCode == ReinvestCodes.AAVE
        ) return AaveV3Reinvest._unwind(amount_, reinvestData_.reinvestData);
    }
}
