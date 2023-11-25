// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDCAExecutor.sol";
import "./interfaces/IDCAAccount.sol";
import "./security/onlyAdmin.sol";
import "./library/Strategys.sol";

contract DCAExecutor is OnlyAdmin, IDCAExecutor {
    using Strategies for uint256;
    using Strategies for IDCADataStructures.Strategy;

    mapping(address => mapping(uint256 => IDCADataStructures.Strategy))
        internal _strategies;
    mapping(address => mapping(uint256 => uint256)) internal _lastExecution;
    IDCADataStructures.FeeDistribution internal _feeData;

    bool internal _active = true;
    address internal _executionEOAAddress;

    uint256 private _totalActiveStrategies;
    uint256 private _totalIntervalsExecuted;

    modifier is_active() {
        require(_active, "DCAExecutor : [isActive] Executor is on pause");
        _;
    }

    constructor(
        IDCADataStructures.FeeDistribution memory feeDistrobution_,
        address executionEOA_
    ) onlyAdmins() {
        _feeData = feeDistrobution_;
        _setExecutionAddress(executionEOA_);
    }

    function Subscribe(
        IDCADataStructures.Strategy calldata strategy_
    ) external override is_active returns (bool success) {
        require(strategy_._isValidStrategy(), "Invalid strategy");
        _subscribeAccount(strategy_);
        _totalActiveStrategies++;
        return true;
    }

    function Unsubscribe(
        address DCAAccountAddress_,
        uint256 strategyId_
    ) external override returns (bool success) {
        _unSubscribeAccount(DCAAccountAddress_, strategyId_);
        _totalActiveStrategies--;
        return true;
    }

    function Execute(
        address DCAAccount_,
        uint256 strategyId_
    ) external override onlyAdmins is_active {
        bool success = _singleExecution(DCAAccount_, strategyId_);
        if (success) {
            emit ExecutedDCA(DCAAccount_, strategyId_);
        }
    }

    function ExecuteBatch(
        address[] memory DCAAccount_,
        uint256[] memory strategyId_
    ) external override onlyAdmins is_active {
        require(DCAAccount_.length <= 10, "Maximum 10 executions allowed");
        require(
            DCAAccount_.length == strategyId_.length,
            "Accounts & Strategy count don't match"
        );
        for (uint256 i = 0; i < DCAAccount_.length; i++) {
            if (
                _lastExecution[DCAAccount_[i]][strategyId_[i]] +
                    Strategies._getIntervalBlockAmount(
                        _strategies[DCAAccount_[i]][strategyId_[i]].interval
                    ) <
                block.number
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
            ) = _calculateFeeSplits(balance);
            _transferFee(_feeData.executionAddress, executorFee, token);
            _transferFee(_feeData.computingAddress, computingFee, token);
            _transferFee(_feeData.adminAddress, adminFee, token);
            emit FeesDistributed(tokenAddress_, balance);
        }
    }

    function ForceUnsubscribe(
        address DCAAccount_,
        uint256 strategyId_
    ) external onlyAdmins {
        require(
            _strategies[DCAAccount_][strategyId_].active,
            "Executor: Account already unsubscribed"
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
        _executionEOAAddress = newExecutionEOA_;
        emit ExecutionEOAAddressChange(newExecutionEOA_, msg.sender);
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

    function _calculateFeeSplits(
        uint256 balance
    )
        internal
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        executorFee = Strategies._calculateFee(
            balance,
            _feeData.amountToExecutor,
            18 // Assuming the token has 18 decimals
        );
        computingFee = Strategies._calculateFee(
            balance,
            _feeData.amountToComputing,
            18
        );
        adminFee = Strategies._calculateFee(
            balance,
            _feeData.amountToAdmin,
            18
        );
        return (executorFee, computingFee, adminFee);
    }

    function _transferFee(
        address to_,
        uint256 amount_,
        IERC20 token_
    ) internal {
        token_.transfer(to_, amount_);
    }
}
