// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {DCAReinvestLogic, ReinvestCodes, IDCADataStructures, IDCAReinvest} from "../logic/ReinvestLogic.sol";
import "../security/onlyActive.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
contract DCAReinvest is DCAReinvestLogic, OnlyActive, Ownable {
    using ReinvestCodes for uint8;

    /**
     * @dev Constructor for the DCAReinvest contract
     * @param activeLibrary_ The state of the reinvest library
     */
    constructor(bool activeLibrary_) Ownable(msg.sender) {
        _setActiveState(activeLibrary_);
    }

    /**
     * @dev Executes the reinvestment
     * @param reinvestData_ The reinvestment data
     * @param amount_ The amount to reinvest
     * @return amount The amount of the reinvestment
     * @return success The success of the reinvestment
     */

    function executeReinvest(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) external override is_active returns (uint256 amount, bool success) {
        return _executeInvest(reinvestData_, amount_);
    }
    /**
     * @dev Unwinds the reinvestment
     * @param reinvestData_ The reinvestment data
     * @param amount_ The amount to unwind
     * @return amount The amount of the unwind
     * @return success The success of the unwind
     */
    function unwindReinvest(
        IDCADataStructures.Reinvest memory reinvestData_,
        uint256 amount_
    ) external override returns (uint256 amount, bool success) {
        return _executeWithdraw(reinvestData_, amount_);
    }

    /**
     * @dev Returns the version of the reinvest library
     * @return The version of the reinvest library
     */
    function getLibraryVersion() public pure returns (string memory) {
        return REINVEST_VERSION;
    }
    /**
     * @dev Returns whether the reinvest library is active
     * @return Whether the reinvest library is active
     */
    function isActive()
        external
        view
        override(IDCAReinvest, OnlyActive)
        returns (bool)
    {
        return _getActiveState();
    }

    /**
     * @dev Returns the active moduals
     * @return The active moduals
     */
    function getActiveModuals()
        external
        view
        override
        returns (uint8[] memory)
    {
        return abi.decode(ACTIVE_REINVESTS, (uint8[]));
    }

    /**
     * @dev Sets the active state of the reinvest library
     */
    function setActiveState() public onlyOwner {
        _setActiveState(!_getActiveState());
    }

    /**
     * @dev Returns the module name for the given code
     * @param code_ The code to get the module name for
     * @return The module name for the given code
     */
    function getModuleName(uint8 code_) external pure returns (string memory) {
        return code_._getModuleName();
    }
}
