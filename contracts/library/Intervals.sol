pragma solidity ^0.8.20;

import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";

library Intervals {
    // Constants for interval block amounts
    uint256 constant ONEMINUTE = 1 minutes; // ONLY FOR TESTING
    uint256 constant ONEHOUR = 1 hours;
    uint256 constant ONEDAY = 1 days;
    uint256 constant TWODAYS = 2 days;
    uint256 constant ONEWEEK = 1 weeks;
    uint256 constant ONEMONTH = 4 weeks;

    uint256 constant BLOCK_TIME = 15 seconds;

    function isInWindow(
        IDCADataStructures.Interval interval_,
        uint256 lastExecution_
    ) internal view returns (bool) {
        return secondsLeftTillWindow(interval_, lastExecution_) == 0;
    }

    /**
     * @notice Function to retrieve the block amount for a given interval
     * @param interval_ {Interval} The interval key
     * @return Amount of blocks to interval
     */
    function getIntervalLength(
        IDCADataStructures.Interval interval_
    ) internal pure returns (uint256) {
        if (interval_ == IDCADataStructures.Interval.TestIntervalOneMin)
            return ONEMINUTE;
        if (interval_ == IDCADataStructures.Interval.TestIntervalFiveMins)
            return ONEMINUTE * 5;
        if (interval_ == IDCADataStructures.Interval.TwelveHours)
            return ONEHOUR * 12;
        if (interval_ == IDCADataStructures.Interval.OneDay) return ONEDAY;
        if (interval_ == IDCADataStructures.Interval.TwoDays) return TWODAYS;
        if (interval_ == IDCADataStructures.Interval.OneWeek) return ONEWEEK;
        if (interval_ == IDCADataStructures.Interval.TwoWeeks)
            return ONEWEEK * 2;

        if (interval_ == IDCADataStructures.Interval.OneMonth) return ONEMONTH;
        revert("DCAStrategy : Invalid interval");
    }

    /**
     * @notice check how many seconds are left till execution window
     * @param lastExecution_ {uint256} last block the strategy was executed on
     * @param interval_ {Interval} Interval key to work from
     * @return {uint256} time left till window is open in seconds
     */
    function secondsLeftTillWindow(
        IDCADataStructures.Interval interval_,
        uint256 lastExecution_
    ) internal view returns (uint256) {
        uint256 intervalEnd = lastExecution_ + getIntervalLength(interval_);
        return
            block.timestamp > intervalEnd ? 0 : intervalEnd - block.timestamp;
    }

    function intervalToBlockAmount(
        IDCADataStructures.Interval interval_
    ) internal pure returns (uint256) {
        return getIntervalLength(interval_) / BLOCK_TIME;
    }
}
