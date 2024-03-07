// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
import {ReinvestCodes} from "../library/Codes.sol";

import {ForwardReinvest} from "../modules/ForwardReinvest.sol";
import {AaveV3Reinvest} from "../modules/AaveV3Reinvest.sol";

abstract contract DCAReinvest {
    using ReinvestCodes for uint8;
    string public constant REINVEST_VERSION = "TEST V0.3";
    bytes public constant ACTIVE_REINVESTS =
        abi.encodePacked(ReinvestCodes.FORWARD, ReinvestCodes.AAVE);

    /**
     * @notice Reinvest strategy struct.
     * If no reinvest set active to false and zero-out other fields
     * If using predefined reinvest strategy zero-out the bytes fields
     * Check code agents the Reinvest Codes library
     *
     * @notice deposit & withdraw reinvest methods only needed IF using custom reinvest strategy
     *
     * @param reinvestData Reinvest strategy specific data (encoded to bytes)
     * @param active If the reinvest is active
     * @param investCode Reinvest strategy code
     * @param dcaAccountAddress address of the account contract
     */

    struct Reinvest {
        bytes reinvestData;
        bool active;
        uint8 investCode;
        address dcaAccountAddress;
    }

    /**
     *
     * @param reinvestData_ {Reinvest} Data of the reinvest strategy
     * @param amount_ {uint256} amount of the token to be invested
     * @return amount {uint256} the amount of the yield baring token recived
     */

    function _executeInvest(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        console.log("ExecutreReinvest Level 2");

        uint8 code = reinvestData_.investCode;

        if (code == ReinvestCodes.NOT_ACTIVE) return (amount, success);
        else if (code == ReinvestCodes.FORWARD)
            return
                ForwardReinvest._execute(amount_, reinvestData_.reinvestData);
        else if (code == ReinvestCodes.COMPOUND) {} else if (
            code == ReinvestCodes.AAVE
        ) return AaveV3Reinvest._execute(amount_, reinvestData_.reinvestData);
    }

    function _executeWithdraw(
        Reinvest memory reinvestData_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (reinvestData_.investCode <= ReinvestCodes.COMPOUND) {} else if (
            reinvestData_.investCode == ReinvestCodes.AAVE
        ) return AaveV3Reinvest._unwind(amount_, reinvestData_.reinvestData);
    }

    /*     function getActiveReinvestLibrarys()public pure returns(uint8[] memory codes){
        codes = abi.decode(ACTIVE_REINVESTS,(uint8[]));
        return codes;
    } */
}
