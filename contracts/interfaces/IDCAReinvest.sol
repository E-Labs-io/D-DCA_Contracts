// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IDCADataStructures} from "./IDCADataStructures.sol";

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
 *      Distributed Cost Average Contracts
 ************************************************
 *                  V0.7
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */
interface IDCAReinvest {
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
    ) external returns (uint256 amount, bool success);

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
    ) external returns (uint256 amount, bool success);

    /**
     * @dev Checks if the reinvestment is active
     * @return isActive Whether the reinvestment is active
     */
    function isActive() external view returns (bool);

    /**
     * @dev Returns the version of the reinvestment
     * @return The version of the reinvestment
     */
    function getLibraryVersion() external view returns (string memory);

    /**
     * @dev Returns the active moduals
     * @return The active moduals
     */
    function getActiveModuals() external view returns (uint8[] memory);
}
