pragma solidity ^0.8.20;
import "hardhat/console.sol";

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
 *      Distributed Cost Average Contracts
 ************************************************
 *                  V0.7
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */
library Fee {
    /**
     * @notice Function to calculate fee based on total fee percentage
     * @param feeAmount_ Total fee percentage (100% represented as 10000)
     * @param amount_ Total amount from which to calculate the fee
     * @return {uint256} Fee amount to be deducted from the total amount
     */
    function getFee(
        uint16 feeAmount_,
        uint256 amount_
    ) internal pure returns (uint256) {
        return calculatePercentage(feeAmount_, amount_);
    }
    /**
     * @dev
     * @param total_ total amount of base token being executed
     * @param fee_ the fee structure
     * @return executorFee
     * @return computingFee
     * @return adminFee
     */
    function getFeeSplit(
        IDCADataStructures.FeeDistribution storage fee_,
        uint256 amount_
    )
        internal
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        executorFee = calculatePercentage(fee_.amountToExecutor, amount_);
        computingFee = calculatePercentage(fee_.amountToComputing, amount_);
        adminFee = calculatePercentage(fee_.amountToAdmin, amount_);
    }

    /**
     * @notice Function to c alculate the percentage of an amount
     * @param percent_ Percentage to calculate (1% represented as 100, 0.01% as 1, and 100% as 10000)
     * @param amount_ Total amount from which to calculate the percentage
     * @return {uint256} The calculated percentage of the amount
     */
    function calculatePercentage(
        uint16 percent_,
        uint256 amount_
    ) internal pure returns (uint256) {
        if (percent_ < 1) return 0;
        uint256 percentageAmount = (amount_ * percent_) / 10000;
        return percentageAmount;
    }

    /**
     * @dev gets the percent of each fee amount in the active fee structure
     * @param fee_ tettheheh fee strucutre
     * @return totalFee
     * @return executorFee
     * @return computingFee
     * @return adminFee
     */
    function getFeeAmounts(
        IDCADataStructures.FeeDistribution calldata fee_
    )
        internal
        pure
        returns (
            uint16 totalFee,
            uint16 executorFee,
            uint16 computingFee,
            uint16 adminFee
        )
    {
        return (
            fee_.feeAmount,
            fee_.amountToExecutor,
            fee_.amountToComputing,
            fee_.amountToAdmin
        );
    }
    /**
     * @dev Check that the split percentages add upto 100% (10,000)
     * @param fee_ fee data set to check
     * @return {bool}
     */

    function checkPercentTotal(
        IDCADataStructures.FeeDistribution memory fee_
    ) internal pure returns (bool) {
        return
            fee_.amountToAdmin +
                fee_.amountToExecutor +
                fee_.amountToComputing ==
            10000;
    }
}
