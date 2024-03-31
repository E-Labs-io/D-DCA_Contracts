// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

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
 ***********************************************
 *___ooo____oooooooo_oooo____oooo____ooo____oo_*
 *_oo___oo_____oo_____oo___oo____oo__oooo___oo_*
 *oo_____oo____oo_____oo__oo______oo_oo_oo__oo_*
 *ooooooooo____oo_____oo__oo______oo_oo__oo_oo_*
 *oo_____oo____oo_____oo___oo____oo__oo___oooo_*
 *oo_____oo____oo____oooo____oooo____oo____ooo_*
 *_____________________________________________*
 *       Dollar Cost Average Contracts
 ***********************************************
 *
 *  x.com/0xAtion
 *  x.com/e_labs_
 *
 *
 */

contract DCAExecutor is OnlyAdmin, OnlyActive, IDCAExecutor {
    using Intervals for uint8;
    using Intervals for uint256;
    using Strategies for Strategy;
    using Fee for uint256;

    mapping(address => mapping(uint256 => Strategy)) internal _strategies;
    mapping(address => mapping(uint256 => uint256)) internal _lastExecution;
    FeeDistribution internal _feeData;

    uint256 private _totalActiveStrategies;
    uint256 private _totalIntervalsExecuted;

    constructor(
        FeeDistribution memory feeDistrobution_,
        address executionEOA_
    ) OnlyExecutor(_msgSender(), executionEOA_) {
        _feeData = feeDistrobution_;
    }

    fallback() external payable {
        revert("DCAExecutor : [fallback]");
    }

    receive() external payable {
        revert("DCAExecutor : [receive]");
    }

    function Subscribe(
        Strategy calldata strategy_
    ) external override is_active {
        require(
            _msgSender() == strategy_.accountAddress,
            "DCAexecutor : [Subscribe] Only Account Contract can unsubscribe"
        );
        require(
            strategy_._isValidStrategy(),
            "DCAexecutor : [Subscribe] Invalid strategy"
        );

        _subscribeAccount(strategy_);
        _totalActiveStrategies++;
    }

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

    function Execute(
        address DCAAccount_,
        uint256 strategyId_
    ) external override onlyExecutor is_active {
        bool success = _singleExecution(DCAAccount_, strategyId_);
        if (success) emit ExecutedDCA(DCAAccount_, strategyId_);
    }

    function ExecuteBatch(
        address[] memory DCAAccount_,
        uint256[] memory strategyId_
    ) external override onlyExecutor is_active {
        require(
            DCAAccount_.length <= 10,
            "DCAExecutor: [ExecuteBatch] Maximum 10 executions allowed"
        );
        require(
            DCAAccount_.length == strategyId_.length,
            "DCAExecutor: [ExecuteBatch] Accounts & Strategy count don't match"
        );
        for (uint256 i = 0; i < DCAAccount_.length; i++) {
            if (
                _lastExecution[DCAAccount_[i]][strategyId_[i]]
                    ._isStrategyInWindow(
                        _strategies[DCAAccount_[i]][strategyId_[i]].interval
                    )
            ) {
                if (_singleExecution(DCAAccount_[i], strategyId_[i])) {
                    emit ExecutedDCA(DCAAccount_[i], strategyId_[i]);
                }
            }
        }
    }

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
            ) = balance._getFees(_feeData);
            _transferFee(_feeData.executionAddress, executorFee, token);
            _transferFee(_feeData.computingAddress, computingFee, token);
            _transferFee(_feeData.adminAddress, adminFee, token);
            emit FeesDistributed(tokenAddress_, balance);
        }
    }

    function ForceUnsubscribe(
        address DCAAccount_,
        uint256 strategyId_
    ) external onlyExecutor {
        require(
            _strategies[DCAAccount_][strategyId_].active,
            "DCAExecutor: [ForceUnsubscribe] Account already unsubscribed"
        );
        _strategies[DCAAccount_][strategyId_].active = false;
        IDCAAccount(DCAAccount_).ExecutorDeactivateStrategy(strategyId_);
        _totalActiveStrategies--;
        emit DCAAccountSubscription(
            DCAAccount_,
            strategyId_,
            _strategies[DCAAccount_][strategyId_].interval,
            false
        );
    }

    function getTotalActiveStrategys() public view returns (uint256) {
        return _totalActiveStrategies;
    }

    function getSpecificStrategy(
        address dcaAccountAddress_,
        uint256 accountStrategyId_
    ) public view returns (IDCADataStructures.Strategy memory) {
        return _strategies[dcaAccountAddress_][accountStrategyId_];
    }

    function getTotalExecutions() public view returns (uint256) {
        return _totalIntervalsExecuted;
    }

    function getActiveExecutorAddress() public view returns (address) {
        return _executor();
    }

    function getFeeData() public view returns (FeeDistribution memory) {
        return _feeData;
    }

    function getFeeQuote(uint256 amount_) public view returns (uint256) {
        return amount_._getFee(_feeData.feeAmount);
    }

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

    function DEVgetFeeOfAmount(
        uint256 amount_
    )
        public
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        return amount_._getFees(_feeData);
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
        emit DCAAccountSubscription(
            strategy_.accountAddress,
            strategy_.strategyId,
            strategy_.interval,
            true
        );
    }

    function _unSubscribeAccount(
        address DCAAccountAddress_,
        uint256 strategyId_
    ) private {
        _strategies[DCAAccountAddress_][strategyId_].active = false;
        emit DCAAccountSubscription(
            DCAAccountAddress_,
            strategyId_,
            _strategies[DCAAccountAddress_][strategyId_].interval,
            false
        );
    }

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

    function _transferFee(
        address to_,
        uint256 amount_,
        IERC20 token_
    ) internal {
        token_.transfer(to_, amount_);
    }
}
