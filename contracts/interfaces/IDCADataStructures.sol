// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDCADataStructures {
    // Define an enum to represent the interval type
    enum Interval {
        TestInterval, //Only for development
        OneDay, // 1 day = 5760 blocks
        TwoDays, // 2 days = 11520 blocks
        OneWeek, // 1 week = 40320 blocks
        OneMonth // 1 month = 172800 blocks
    }

    struct FeeDistribution {
        //These may move to s struct or set of if more call data is needed
        uint16 amountToExecutor; //In percent
        uint16 amountToComputing; //In percent
        uint16 amountToAdmin;
        uint16 feeAmount; //In percent
        address executionAddress;
        address computingAddress; //need to look into how distributed computing payments work
        address adminAddress;
    }

    // Define the Strategy struct
    struct Strategy {
        address accountAddress;
        TokeData baseToken;
        TokeData targetToken;
        Interval interval;
        uint256 amount;
        uint256 strategyId;
        bool reinvest;
        bool active;
        address revestContract; // should this be call data to execute?
    }

    struct TokeData {
        address tokenAddress;
        uint8 decimals;
        string ticker;
    }
}
