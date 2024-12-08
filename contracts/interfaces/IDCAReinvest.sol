// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IDCADataStructures} from "./IDCADataStructures.sol";

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
