pragma solidity ^0.8.20;

import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";

library Fee {
    function _getFee(
        uint16 feeAmount_,
        uint256 amount_
    ) internal pure returns (uint256) {
        return _calculateFee(amount_, 10000, feeAmount_);
    }
    /**
     * @dev
     * @param total_ total amount of base token being executed
     * @param fee_ the fee structure
     * @return executorFee
     * @return computingFee
     * @return adminFee
     */
    function _getFees(
        uint256 total_,
        IDCADataStructures.FeeDistribution storage fee_
    )
        internal
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        executorFee = _calculateFee(
            total_,
            fee_.amountToExecutor,
            fee_.feeAmount
        );
        computingFee = _calculateFee(
            total_,
            fee_.amountToComputing,
            fee_.feeAmount
        );
        adminFee = _calculateFee(total_, fee_.amountToAdmin, fee_.feeAmount);
    }

    /**
     * @notice Function to calculate fees
     * @param amount {uint256} Amount of token to calculate to
     * @param feePercentage The percent to be worked out
     * @param totalFeePercentage The total fee percentage
     * @return {uint256} How much the percent is of the given amount
     */
    function _calculateFee(
        uint256 amount,
        uint16 feePercentage,
        uint16 totalFeePercentage
    ) internal pure returns (uint256) {
        uint256 feeDecimal = (amount * feePercentage) / totalFeePercentage;
        return feeDecimal;
    }

    /**
     * @dev gets the percent of each fee amount in the active fee structure
     * @param fee_ teh fee strucutre
     * @return totalFee
     * @return executorFee
     * @return computingFee
     * @return adminFee
     */
    function _getFeeAmounts(
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
}
