// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDCADataStructures.sol";
import {Intervals} from "./Intervals.sol";

library Strategies {
    using Intervals for uint8;
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



}
