// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IDCAExecutor.sol";
import "../interfaces/IDCAAccount.sol";
import "../security/onlyAdmin.sol";
import "../security/onlyExecutor.sol";
import "../security/onlyActive.sol";
import {Strategies} from "../library/Strategys.sol";
import {Fee} from "../library/Fees.sol";
import {Intervals} from "../library/Intervals.sol";

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
 *       Dollar Cost Average Contracts
 ************************************************
 *                  V0.7
 *  ation.capital
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */

contract DCAExecutor is OnlyAdmin, OnlyExecutor, OnlyActive, IDCAExecutor {
    using Intervals for Interval;
    using Strategies for Strategy;
    using Fee for uint16;
    using Fee for FeeDistribution;

    mapping(Interval => bool) private _activeIntervals;

    mapping(address => mapping(uint256 => Strategy)) internal _strategies;
    mapping(address => mapping(uint256 => uint256)) internal _lastExecution;
    FeeDistribution internal _feeData;

    mapping(Interval => uint256) internal _totalActiveStrategiesByIntervals;

    uint256 private _totalActiveStrategies;
    uint256 private _totalIntervalsExecuted;

    /**
     * @dev Constructor for the DCAExecutor contract
     * @param feeDistrobution_ The fee distribution data
     * @param executionEOA_ The address of the execution EOA
     */
    constructor(
        FeeDistribution memory feeDistrobution_,
        address executionEOA_
    ) OnlyExecutor(msg.sender, executionEOA_) {
        setFeeData(feeDistrobution_);
    }

    /**
     * @dev Fallback function for the DCAExecutor contract
     */
    fallback() external payable {
        revert("DCAExecutor : [fallback]");
    }

    receive() external payable {
        revert("DCAExecutor : [receive]");
    }

    /**
     * @dev Subscribes a strategy to the DCAExecutor
     * @param strategy_ The strategy data
     */
    function Subscribe(
        Strategy calldata strategy_
    ) external override is_active {
        require(
            _msgSender() == strategy_.accountAddress,
            "DCAexecutor : [Subscribe] Only Account Contract can unsubscribe"
        );
        require(
            strategy_.isValid(),
            "DCAexecutor : [Subscribe] Invalid strategy"
        );
        require(
            isIntervalActive(strategy_.interval),
            "DCAexecutor : [Subscribe] Interval Not Active"
        );
        _subscribeAccount(strategy_);
        _totalActiveStrategies++;
        _totalActiveStrategiesByIntervals[strategy_.interval]++;
    }

    /**
     * @dev Unsubscribes a strategy from the DCAExecutor
     * @param DCAAccountAddress_ The address of the DCAAccount
     * @param strategyId_ The id of the strategy to unsubscribe
     */
    function Unsubscribe(
        address DCAAccountAddress_,
        uint256 strategyId_
    ) external override {
        require(
            _msgSender() == DCAAccountAddress_,
            "DCAexecutor : [Unsubscribe] Only Account Contract can unsubscribe"
        );
        _unSubscribeAccount(DCAAccountAddress_, strategyId_);
        _totalActiveStrategies--;
    }

    /**
     * @dev Executes a single strategy
     * @param DCAAccount_ The address of the DCAAccount
     * @param strategyId_ The id of the strategy to execute
     */
    function Execute(
        address DCAAccount_,
        uint256 strategyId_
    ) external override onlyExecutor is_active {
        bool success = _singleExecution(DCAAccount_, strategyId_);
        if (success) {
            emit ExecutedStrategy(DCAAccount_, strategyId_);
            _totalIntervalsExecuted++;
        }
    }

    /**
     * @dev Distributes the fees for the given token
     * @param tokenAddress_ The address of the token to distribute fees for
     */
    function DistributeFees(
        address tokenAddress_
    ) external override onlyAdmins {
        IERC20 token = IERC20(tokenAddress_);
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            (
                uint256 executorFee,
                uint256 computingFee,
                uint256 adminFee
            ) = _feeData.getFeeSplit(balance);
            _transferFee(_feeData.executionAddress, executorFee, token);
            _transferFee(_feeData.computingAddress, computingFee, token);
            _transferFee(_feeData.adminAddress, adminFee, token);
            emit FeesDistributed(tokenAddress_, balance);
        }
    }

    /**
     * @dev Forces the unsubscription of a strategy
     * @param DCAAccount_ The address of the DCAAccount
     * @param strategyId_ The id of the strategy to unsubscribe
     */
    function ForceUnsubscribe(
        address DCAAccount_,
        uint256 strategyId_
    ) external onlyExecutor {
        require(
            _strategies[DCAAccount_][strategyId_].active,
            "DCAExecutor: [ForceUnsubscribe] Account already unsubscribed"
        );
        _strategies[DCAAccount_][strategyId_].active = false;
        IDCAAccount(DCAAccount_).ExecutorDeactivate(strategyId_);
        _totalActiveStrategies--;
        emit StrategySubscription(
            DCAAccount_,
            strategyId_,
            _strategies[DCAAccount_][strategyId_].interval,
            false
        );
    }

    /**
     * @dev Sets the fee data for the DCAExecutor
     * @param fee_ The fee distribution data
     */
    function setFeeData(
        IDCADataStructures.FeeDistribution memory fee_
    ) public onlyOwner {
        require(
            fee_.checkPercentTotal(),
            "DCAExecutor : [setFeeData] Total split percents don't equal 100%"
        );
        _feeData = fee_;
        emit FeeDataChanged();
    }

    /**
     * @dev Sets the active state of the DCAExecutor
     * @param newFlag_ The new active state
     */
    function setActiveState(bool newFlag_) public onlyAdmins {
        _setActiveState(newFlag_);
    }

    /**
     * @dev Returns the specific strategy for the given DCAAccount and strategy id
     * @param dcaAccountAddress_ The address of the DCAAccount
     * @param accountStrategyId_ The id of the strategy
     * @return The strategy data
     */
    function getSpecificStrategy(
        address dcaAccountAddress_,
        uint256 accountStrategyId_
    ) public view returns (IDCADataStructures.Strategy memory) {
        return _strategies[dcaAccountAddress_][accountStrategyId_];
    }

    /**
     * @dev Returns the total number of executions
     * @return The total number of executions
     */
    function getTotalExecutions() public view returns (uint256) {
        return _totalIntervalsExecuted;
    }

    /**
     * @dev Returns the active executor address
     * @return The active executor address
     */
    function getActiveExecutorAddress() public view returns (address) {
        return _executor();
    }

    /**
     * @dev Returns the fee data for the DCAExecutor
     * @return The fee data
     */
    function getFeeData() public view returns (FeeDistribution memory) {
        return _feeData;
    }

    /**
     * @dev Returns the time till window for the given DCAAccount and strategy id
     * @param account_ The address of the DCAAccount
     * @param strategyId_ The id of the strategy
     * @return lastEx The last execution block number
     * @return secondsLeft The seconds left till window
     * @return checkReturn The check return
     */
    function getTimeTillWindow(
        address account_,
        uint256 strategyId_
    )
        external
        view
        returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
    {
        return
            IDCAAccount(_strategies[account_][strategyId_].accountAddress)
                .getTimeTillWindow(strategyId_);
    }

    /**
     * @dev Sets the active state of the given interval
     * @param interval_ The interval to set the active state for
     * @param status_ The new active state
     */
    function setIntervalActive(
        Interval interval_,
        bool status_
    ) external onlyAdmins {
        _activeIntervals[interval_] = status_;
    }

    /**
     * @dev Returns the active state of the given interval
     * @param interval_ The interval to get the active state for
     * @return The active state of the given interval
     */
    function isIntervalActive(Interval interval_) public view returns (bool) {
        return _activeIntervals[interval_];
    }

    /**
     *
     * @notice Internal & Private Functions
     */

    function _subscribeAccount(
        IDCADataStructures.Strategy memory strategy_
    ) internal {
        strategy_.active = true;
        _strategies[strategy_.accountAddress][strategy_.strategyId] = strategy_;
        emit StrategySubscription(
            strategy_.accountAddress,
            strategy_.strategyId,
            strategy_.interval,
            true
        );
    }

    /**
     * @dev Unsubscribes a strategy from the DCAExecutor
     * @param DCAAccountAddress_ The address of the DCAAccount
     * @param strategyId_ The id of the strategy to unsubscribe
     */
    function _unSubscribeAccount(
        address DCAAccountAddress_,
        uint256 strategyId_
    ) private {
        Strategy memory strategy = _strategies[DCAAccountAddress_][strategyId_];
        _strategies[DCAAccountAddress_][strategyId_].active = false;
        _totalActiveStrategiesByIntervals[strategy.interval]--;

        emit StrategySubscription(
            DCAAccountAddress_,
            strategyId_,
            strategy.interval,
            false
        );
    }

    /**
     * @dev Sets the execution address for the DCAExecutor
     * @param newExecutionEOA_ The new execution EOA address
     */
    function _setExecutionAddress(address newExecutionEOA_) internal {
        _changeExecutorAddress(newExecutionEOA_);
    }

    function _singleExecution(
        address accountAddress_,
        uint256 strategyId_
    ) internal returns (bool) {
        bool success = IDCAAccount(accountAddress_).Execute(
            strategyId_,
            _feeData.feeAmount
        );
        if (success) {
            _lastExecution[accountAddress_][strategyId_] = block.number;
        }
        return success;
    }

    /**
     * @dev Transfers the fee to the given address
     * @param to_ The address to transfer the fee to
     * @param amount_ The amount of the fee to transfer
     * @param token_ The token to transfer the fee in
     */
    function _transferFee(
        address to_,
        uint256 amount_,
        IERC20 token_
    ) internal {
        token_.transfer(to_, amount_);
    }

    /** Stats Getters */

    /**
     * @dev Returns the total number of active strategies
     * @return The total number of active strategies
     */
    function getTotalActiveStrategys() public view returns (uint256) {
        return _totalActiveStrategies;
    }

    /**
     * @dev Returns the total number of active strategies for the given interval
     * @param interval_ The interval to get the total number of active strategies for
     * @return The total number of active strategies for the given interval
     */
    function getIntervalTotalActiveStrategys(
        Interval interval_
    ) public view returns (uint256) {
        return _totalActiveStrategiesByIntervals[interval_];
    }
}
