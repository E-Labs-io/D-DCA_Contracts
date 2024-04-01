pragma solidity ^0.8.20;
import "hardhat/console.sol";

import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";

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
        console.log("Total Fee Percent", feeAmount_);
        console.log("total In", amount_);
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
    function getFees(
        IDCADataStructures.FeeDistribution storage fee_,
        uint256 amount_
    )
        internal
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        uint256 totalFee = calculatePercentage(fee_.feeAmount, amount_);
        executorFee = calculatePercentage(fee_.amountToExecutor, totalFee);
        computingFee = calculatePercentage(fee_.amountToComputing, totalFee);
        adminFee = calculatePercentage(fee_.amountToAdmin, totalFee);
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
        console.log("Finding", percent_, "of", amount_);
        uint256 percentageAmount = (amount_ * percent_) / 10000;
        console.log("answer is", percentageAmount);

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
