// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDCADataStructures.sol";

library Strategies {
    // Constants for interval block amounts
    uint256 constant ONEMINUTE = 1 minutes; // ONLY FOR TESTING
    uint256 constant ONEHOUR = 1 hours;
    uint256 constant ONEDAY = 1 days;
    uint256 constant TWODAYS = 2 days;
    uint256 constant ONEWEEK = 1 weeks;
    uint256 constant ONEMONTH = 4 weeks;

    uint256 constant BLOCK_TIME = 15;

    /**
     *
     * @param strategy the strategy object to check
     * @return {bool} if the Strategy data is valid
     */
    function _isValidStrategy(
        IDCADataStructures.Strategy memory strategy
    ) internal pure returns (bool) {
        // Define the maximum valid enum value
        uint maxIntervalValue = uint(IDCADataStructures.Interval.OneMonth); // Assuming 'OneMonth' is the last in your enum

        // Check interval is within the range of defined enum values
        bool isValidInterval = uint(strategy.interval) <= maxIntervalValue;

        return (strategy.accountAddress != address(0) &&
            strategy.baseToken.tokenAddress != address(0) &&
            strategy.targetToken.tokenAddress != address(0) &&
            strategy.amount > 0 &&
            isValidInterval);
    }

    function _isStrategyInWindow(
        uint256 lastExecution_,
        IDCADataStructures.Interval interval_
    ) internal view returns (bool) {
        return _secondsLeftTilLWindow(lastExecution_, interval_) == 0;
    }

    /**
     * @notice Function to retrieve the block amount for a given interval
     * @param interval_ {Interval} The interval key
     * @return Amount of blocks to interval
     */
    function _getIntervalBlockAmount(
        IDCADataStructures.Interval interval_
    ) internal pure returns (uint256) {
        if (interval_ == IDCADataStructures.Interval.TestIntervalOneMin)
            return ONEMINUTE;
        if (interval_ == IDCADataStructures.Interval.TestIntervalFiveMins)
            return ONEMINUTE * 5;
        if (interval_ == IDCADataStructures.Interval.OneDay) return ONEDAY;
        if (interval_ == IDCADataStructures.Interval.TwoDays) return TWODAYS;
        if (interval_ == IDCADataStructures.Interval.OneWeek) return ONEWEEK;
        if (interval_ == IDCADataStructures.Interval.OneMonth) return ONEMONTH;
        revert("DCAStrategy : Invalid interval");
    }

    /**
     * @notice check how many blocks are left till execution window
     * @param lastExecution_ {uint256} last block the strategy was executed on
     * @param interval_ {Interval} Interval key to work from
     * @return {uint256} time left till window is open in blocks
     */
    function _blocksLeftTillWindow(
        uint256 lastExecution_,
        IDCADataStructures.Interval interval_
    ) internal view returns (uint256) {
        return
            block.number -
            (lastExecution_ + _getIntervalBlockAmount(interval_));
    }

    function _secondsLeftTilLWindow(
        uint256 lastExecution_,
        IDCADataStructures.Interval interval_
    ) internal view returns (uint256) {
        uint256 intervalEnd = lastExecution_ +
            Strategies._getIntervalBlockAmount(interval_);

        return
            block.timestamp > intervalEnd ? 0 : intervalEnd - block.timestamp;
    }

    /**
     * @notice check how many seconds are left till execution window
     * @param lastExecution_ {uint256} last block the strategy was executed on
     * @param interval_ {Interval} Interval key to work from
     * @return {uint256} time left till window is open in seconds
     */
    function _secondsLeftTillWindow(
        uint256 lastExecution_,
        IDCADataStructures.Interval interval_
    ) internal view returns (uint256) {
        return _blocksLeftTillWindow(lastExecution_, interval_) * BLOCK_TIME;
    }

    /**
     * @notice Function to calculate fees
     * @param amount {uint256} Amount of token to calculate to
     * @param feePercentage The percent to be worked out
     * @param decimals how many decimals the token has
     * @return {uint256} How much the percent is of the given amount
     */
    function _calculateFee(
        uint256 amount,
        uint16 feePercentage,
        uint8 decimals
    ) internal pure returns (uint256) {
        uint256 feeDecimal = feePercentage * 10 ** (decimals - 2);
        return (amount * feeDecimal) / 10 ** decimals;
    }
}
