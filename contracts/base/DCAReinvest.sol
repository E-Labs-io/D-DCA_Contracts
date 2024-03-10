// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";

import {DCAReinvestLogic} from "../utils/DCAReinvestLogic.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DCAReinvest is DCAReinvestLogic, Ownable {
    constructor(bool activeLibrary) Ownable(msg.sender) {
        _setActiveState(activeLibrary);
    }

    function executeReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_, amount_);
    }
    function unwindReinvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) external returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, amount_);
    }

    function migrateReinvest(
        Reinvest memory oldReinvestData_,
        Reinvest memory newReinvestData_,
        bool withdrawFunds_
    ) external returns (uint256 amount, bool success) {
        return (amount, success);
    }

    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }

    function setActiveState() public onlyOwner {
        _setActiveState(!REINVEST_ACTIVE);
    }
}
