// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IDCADataStructures {
    // Define an enum to represent the interval type
    // Interval enum as you defined
    enum Interval {
        TestIntervalOneMin, //Only for development 4 blocks
        TestIntervalFiveMins, //Only for development 20 blocks
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

    /**
     * @notice Reinvest strategy struct.
     * If no reinvest set active to false and zero-out other fields
     * If using predefined reinvest strategy zero-out the bytes fields
     * Check code agents the Reinvest Codes library
     *
     * @notice deposit & withdraw reinvest methods only needed IF using custom reinvest strategy
     *
     * @param reinvestData Reinvest strategy specific data (encoded to bytes)
     * @param active If the reinvest is active
     * @param investCode Reinvest strategy code
     * @param dcaAccountAddress address of the account contract
     */

    struct Reinvest {
        bytes reinvestData;
        bool active;
        uint8 investCode;
        address dcaAccountAddress;
    }
}
