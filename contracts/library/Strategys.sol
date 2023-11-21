// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Strategies {
    uint256 constant ONEMINUTE = 4; // ONLY FOR TESTING
    uint256 constant ONEHOUR = 240;
    uint256 constant ONEDAY = 5760;
    uint256 constant TWODAYS = 11520;
    uint256 constant ONEWEEK = 40320;
    uint256 constant ONEMONTH = 172800;

    enum Interval {
        TestInterval, //Only for development 20blocks
        OneDay, // 1 day = 5760 blocks
        TwoDays, // 2 days = 11520 blocks
        OneWeek, // 1 week = 40320 blocks
        OneMonth // 1 month = 172800 blocks
    }

    function getIntervalBlockAmount(
        Interval interval_
    ) internal pure returns (uint256) {
        if (interval_ == Interval.TestInterval) return ONEMINUTE * 2;
        if (interval_ == Interval.OneDay) return ONEDAY;
        if (interval_ == Interval.TwoDays) return TWODAYS;
        if (interval_ == Interval.OneWeek) return ONEWEEK;
        if (interval_ == Interval.OneMonth) return ONEMONTH;
        return 0;
    }
}
