// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//DEV
import "hardhat/console.sol";
import {ReinvestCodes} from "../library/Codes.sol";
import {ForwardReinvest} from "../modules/ForwardReinvest.sol";
import {AaveV3Reinvest} from "../modules/AaveV3Reinvest.sol";
import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";

abstract contract DCAReinvestLogic {
    using ReinvestCodes for uint8;
    bool public REINVEST_ACTIVE;
    string public constant REINVEST_VERSION = "TEST V0.4";
    uint256 public constant REINVEST_CHAIN = 420;

    bytes public constant ACTIVE_REINVESTS =
        abi.encodePacked(ReinvestCodes.FORWARD, ReinvestCodes.AAVE);

    function _setActiveState(bool state_) internal {
        REINVEST_ACTIVE = state_;
    }

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

        if (code == ReinvestCodes.NOT_ACTIVE) return (amount, success);
        else if (code == ReinvestCodes.FORWARD)
            return
                ForwardReinvest._execute(amount_, reinvestData_.reinvestData);
        else if (code == ReinvestCodes.COMPOUND) {} else if (
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
