// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
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
interface IDCADataStructures {
    /**
     * @notice List of available intervals for executions
     * @notice Timing will be in seconds
     * @dev Check agenst Executor if the strategy interval is active
     */
    enum Interval {
        TestIntervalOneMin, //Only for development
        TestIntervalFiveMins, //Only for development
        OneDay,
        TwoDays,
        OneWeek,
        TwoWeeks,
        OneMonth
    }

    /**
     * @notice The fee distribution struct
     * @dev Working by a factor of 100 (100% = 10000)
     * @dev Executor, Computing and Admin fees should add up to 100%
     * @param amountToExecutor Percent of the FEE going to Executor EOA
     * @param amountToComputing Percent of the FEE going to Executor Computing costs
     * @param amountToAdmin Percent of the FEE going to admin
     * @param feeAmount Total amount of the pre-execution to be taken as fee
     * @param executionAddress The address of the executor
     * @param computingAddress The address of the computing
     * @param adminAddress The address of the admin
     */
    struct FeeDistribution {
        uint16 amountToExecutor; //In percent (where 10000 = 100%, 100 = 1%, etc.)
        uint16 amountToComputing; //In percent (where 10000 = 100%, 100 = 1%, etc.)
        uint16 amountToAdmin; //In percent (where 10000 = 100%, 100 = 1%, etc.)
        uint16 feeAmount; //In percent
        address executionAddress;
        address computingAddress; //need to look into how distributed computing payments work
        address adminAddress;
    }

    /**
     * @notice The data struct defining the DCA Strategy
     * @param accountAddress Address of the account the strategy belongs to
     * @param baseToken The base token data
     * @param targetToken The target token data
     * @param interval The interval for the strategy
     * @param amount The amount of the base token to invest each interval
     * @param strategyId The ID of the strategy
     * @param active Whether the strategy is active
     * @param reinvest The reinvest data
     *
     * @dev strategyId is assigned by the account contract
     *
     */
    struct Strategy {
        address accountAddress;
        TokenData baseToken;
        TokenData targetToken; //use 0x0 for ETH
        Interval interval;
        uint256 amount;
        uint256 strategyId;
        bool active;
        Reinvest reinvest;
    }

    /**
     *  @notice Token Data struct
     * @param tokenAddress The address of the token (i using native token use zero address address(0x0))
     * @param decimals The amount of decimals the token uses
     * @param ticker Of the token
     */
    struct TokenData {
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
