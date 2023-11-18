// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDCAExecutor.sol";
import "./interfaces/IDCAAccount.sol";
import "./security/onlyAdmin.sol";

contract DCAExecutor is OnlyAdmin, IDCAExecutor {
    //  Mapping of all account strategy that subscribe
    //  DCAAccount => StrategyId => Strategy Data
    mapping(address => mapping(uint256 => Strategy)) internal _strategies;
    //Mapping of interval times to the last execution block time
    mapping(address => mapping(uint256 => uint256)) internal _lastExecution;
    // Mapping of Interval enum to block amounts
    mapping(Interval => uint256) internal IntervalTimings;

    FeeDistribution internal _feeData;

    bool internal _active = true;
    address internal _executionEOAAddress;

    uint256 private _totalActiveStrategies;
    uint256 private _totalIntervalsExecuted;

    modifier is_active() {
        require(_active, "DCA is on pause");
        _;
    }
    modifier inWindow(address DCAAccount_, uint256 strategyId_) {
        require(
            _lastExecution[DCAAccount_][strategyId_] +
                IntervalTimings[
                    _strategies[DCAAccount_][strategyId_].interval
                ] <
                block.timestamp,
            "DCA Interval not met"
        );
        _;
    }

    constructor(
        FeeDistribution memory feeDistrobution_,
        address executionEOA_
    ) onlyAdmins() {
        _feeData = feeDistrobution_;
        _setExecutionAddress(executionEOA_);
        _setIntervalBlockAmounts();
    }

    function Subscribe(
        Strategy calldata strategy_
    ) external override is_active returns (bool sucsess) {
        //Adds the DCA account to the given strategy interval list.
        _subscribeAccount(strategy_);
        _totalActiveStrategies++;
        return true;
    }

    function Unsubscribe(
        Strategy calldata strategy_
    ) external override returns (bool sucsess) {
        //Remove the given stragety from the list
        _totalActiveStrategies--;
        _unSubscribeAccount(strategy_);
        return sucsess = true;
    }

    function Execute(
        address DCAAccount_,
        uint256 strategyId_
    )
        external
        override
        onlyAdmins
        is_active
        inWindow(DCAAccount_, strategyId_)
    {
        _singleExecution(DCAAccount_, strategyId_);
        emit ExecutedDCA(DCAAccount_, strategyId_);
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
            // Check the DCA Interval, continue to the next iteration if not met
            if (
                _lastExecution[DCAAccount_[i]][strategyId_[i]] +
                    IntervalTimings[
                        _strategies[DCAAccount_[i]][strategyId_[i]].interval
                    ] >=
                block.timestamp
            ) {
                continue;
            }

            // Try to execute and catch any failure without interrupting the loop
            bool success = _singleExecution(DCAAccount_[i], strategyId_[i]);
            if (success) emit ExecutedDCA(DCAAccount_[i], strategyId_[i]);
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

    function GetTotalActiveStrategys() public view returns (uint256) {
        return _totalActiveStrategies;
    }

    function GetSpesificStrategy(
        address dcaAccountAddress_,
        uint256 accountStrategyId_
    ) public view returns (Strategy memory) {
        return _strategies[dcaAccountAddress_][accountStrategyId_];
    }

    function _subscribeAccount(Strategy memory strategy_) internal {
        strategy_.active = true;
        _strategies[strategy_.accountAddress][strategy_.strategyId] = strategy_;
        emit DCAAccountSubscription(
            strategy_.accountAddress,
            strategy_.strategyId,
            strategy_.interval,
            true
        );
    }

    function _unSubscribeAccount(Strategy calldata strategy_) private {
        _strategies[strategy_.accountAddress][strategy_.strategyId]
            .active = false;
        emit DCAAccountSubscription(
            strategy_.accountAddress,
            strategy_.strategyId,
            strategy_.interval,
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
        try
            IDCAAccount(accountAddress_).Execute(
                strategyId_,
                _feeData.feeAmount
            )
        {
            _lastExecution[accountAddress_][strategyId_] = block.timestamp;
            return true;
        } catch {
            return false;
        }
    }

    // Calculates the fee splits based on the provided balance
    function _calculateFeeSplits(
        uint256 balance
    )
        internal
        view
        returns (uint256 executorFee, uint256 computingFee, uint256 adminFee)
    {
        // Calculate individual fees
        executorFee = (balance * _feeData.amountToExecutor) / 10000;
        computingFee = (balance * _feeData.amountToComputing) / 10000;
        adminFee = (balance * _feeData.amountToAdmin) / 10000;

        return (executorFee, computingFee, adminFee);
    }

    function _transferFee(
        address to_,
        uint256 amount_,
        IERC20 token_
    ) internal {
        token_.transfer(to_, amount_);
    }

    function _setIntervalBlockAmounts() internal {
        //  Set the interval block amounts
        IntervalTimings[Interval.TestInterval] = 20;
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }
}
