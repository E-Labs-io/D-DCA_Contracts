// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Codes.sol";

//import "./CompoundV3Reinvest.sol";

abstract contract DCAReinvest {
    using ReinvestCodes for uint8;

    /**
     * @notice Reinvest strategy struct.
     * If no reinvest set active to false and zero-out other fields
     * If using predefined reinvest strategy zero-out the bytes fields
     * Check code agents the Reinvest Codes library
     *
     * @notice deposit & withdraw reinvest methods only needed IF using custom reinvest strategy
     *
     * @param active if reinvest is active for the strategy
     * @param investCode actionable code for predefined reinvest data
     * @param depositReinvestMethod encoded function for custom reinvest strategies
     * @param withdrawReinvestMethod encoded function for custom reinvest withdraw
     * @param reinvestSpender address of the reinvest interaction contract, contract that needs to spend the token
     */

    struct Reinvest {
        bool active;
        uint8 investCode;
        bytes depositReinvestMethod;
        bytes withdrawReinvestMethod;
        address reinvestSpender; // Address of the contract that needs approval to spend (protocol entry contract)
    }

    /**
     *
     * @param reinvestData_ {Reinvest} Data of the reinvest strategy
     * @param tokenAddress_ {address} the underline token that will be reinvested (target token)
     * @param amount_ {uint256} amount of the token to be invested
     * @return amount {uint256} the amount of the yield baring token recived
     */

    function _executeInvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (uint256 amount) {
        if (reinvestData_.investCode == ReinvestCodes.NOT_ACTIVE) return 0;
        if (reinvestData_.investCode == ReinvestCodes.CUSTOM) {
            // execute the custom reinvest logic
            amount = _customReinvest(reinvestData_, tokenAddress_, amount_);
        } else if (reinvestData_.investCode <= ReinvestCodes.COMPOUND_ETH) {
            // pass to an execute Compound data
            /*   amount = CompoundV3Reinvest._supplyCompound(
                code_,
                amount_,
                tokenAddress_
            ); */
        } else if (reinvestData_.investCode <= ReinvestCodes.AAVE_ETH) {}
    }

    function _executeWithdraw(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (bool success, uint256 amount) {
        if (reinvestData_.investCode == ReinvestCodes.CUSTOM) {
            // execute the custom reinvest logic
            amount = _customReinvest(reinvestData_, tokenAddress_, amount_);
        } else if (reinvestData_.investCode <= ReinvestCodes.COMPOUND_ETH) {
            // pass to an execute Compound data
            /*      amount = CompoundV3Reinvest._supplyCompound(
                code_,
                amount_,
                tokenAddress_
            ); */
        } else if (reinvestData_.investCode <= ReinvestCodes.AAVE_ETH) {}
    }

    function _customReinvest(
        Reinvest memory reinvestData_,
        address tokenAddress_,
        uint256 amount_
    ) internal returns (uint256 amount) {}

    function _customWithdraw() internal returns (uint256 amount) {}
}
