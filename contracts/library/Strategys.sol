// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDCADataStructures.sol";
import {Intervals} from "./Intervals.sol";
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
library Strategies {
    using Intervals for uint8;
    /**
     *
     * @param strategy the strategy object to check
     * @return {bool} if the Strategy data is valid
     */
    function isValid(
        IDCADataStructures.Strategy memory strategy
    ) internal pure returns (bool) {
        // Define the maximum valid enum value
        uint maxIntervalValue = uint(IDCADataStructures.Interval.OneMonth); // Assuming 'OneMonth' is the last in your enum

        // Check interval is within the range of defined enum values
        bool isValidInterval = uint(strategy.interval) <= maxIntervalValue;

        return (strategy.accountAddress != address(0) &&
            strategy.baseToken.tokenAddress != address(0) &&
            strategy.amount > 0 &&
            isValidInterval);
    }

    function isActive(
        IDCADataStructures.Strategy memory strategy_
    ) internal pure returns (bool) {
        return strategy_.active;
    }

    function baseAddress(
        IDCADataStructures.Strategy memory strategy_
    ) internal pure returns (address) {
        return strategy_.baseToken.tokenAddress;
    }

    function targetAddress(
        IDCADataStructures.Strategy memory strategy_
    ) internal pure returns (address) {
        return strategy_.targetToken.tokenAddress;
    }

    function getTokenAddresses(
        IDCADataStructures.Strategy memory strategy_
    ) internal pure returns (address, address) {
        return (
            strategy_.baseToken.tokenAddress,
            strategy_.targetToken.tokenAddress
        );
    }
}
