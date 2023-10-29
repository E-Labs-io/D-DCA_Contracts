// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IDCAAccount.sol";

interface DCADataStructures {
    // Define an enum to represent the interval type
    enum Interval {
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
        IDCAAccount accountAddress;
        IERC20 baseToken;
        IERC20 targetToken;
        Interval interval;
        uint amount;
        uint strategyId;
        bool reinvest;
        bool active;
        address revestContract; // should this be call data to execute?
    }
}
