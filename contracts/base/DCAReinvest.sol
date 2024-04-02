// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";

import {DCAReinvestLogic, IDCADataStructures} from "../logic/ReinvestLogic.sol";
import "../security/onlyActive.sol";

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
contract DCAReinvest is DCAReinvestLogic, OnlyActive {
    constructor(bool activeLibrary) Ownable(msg.sender) {
        _setActiveState(activeLibrary);
    }

    function executeReinvest(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) external is_active returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_, amount_);
    }
    function unwindReinvest(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, amount_);
    }

    function migrateReinvest(
        IDCADataStructures.Reinvest memory oldReinvestData_,
        IDCADataStructures.Reinvest memory newReinvestData_,
        bool withdrawFunds_
    ) external returns (uint256 amount, bool success) {
        return (amount, success);
    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }

    function setActiveState() public onlyOwner {
        _setActiveState(!_getActiveState());
    }
}
