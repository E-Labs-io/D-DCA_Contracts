// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDCADataStructures {
    // Define an enum to represent the interval type
    enum Interval {
        TestIntervalOneMin, //Only for development 4 Blocks
        TestIntervalFiveMins, //Only for development 20 Blocks
        OneDay, // 1 day = 5760 blocks
        TwoDays, // 2 days = 11520 blocks
        OneWeek, // 1 week = 40320 blocks
        OneMonth // 1 month = 172800 blocks
    }

    struct FeeDistribution {
        //These may move to s struct or set of if more call data is needed
        //  Executor, Computing and Admin fees should add up to 100%
        uint16 amountToExecutor; //In percent (where 10000 = 100%, 100 = 1%, etc.)
        uint16 amountToComputing; //In percent (where 10000 = 100%, 100 = 1%, etc.)
        uint16 amountToAdmin; //In percent (where 10000 = 100%, 100 = 1%, etc.)
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
        bool active;
        Reinvest reinvest;
    }

    struct TokeData {
        address tokenAddress;
        uint8 decimals;
        string ticker;
    }

    struct Reinvest {
        bool active;
        bytes depositReinvestMethod;
        bytes withdrawReinvestMethod;
    }
}
