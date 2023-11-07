// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDCAExecutor.sol";
import "./interfaces/IDCAAccount.sol";
import "./security/onlyAdmin.sol";

contract DCAExecutor is OnlyAdmin, IDCAExecutor {
    //Mapping of all _active strategy for the given interval
    mapping(Interval => Strategy[]) internal _strategies;
    // DCAAccount Address => Account Strat Id => local id
    mapping(address => mapping(uint256 => uint256)) internal _localStratId;
    //Mapping of interval times to the last execution block time
    mapping(Interval => uint256) internal _lastExecution;
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
    modifier inWindow(Interval interval_) {
        require(
            _lastExecution[interval_] + IntervalTimings[interval_] <
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
        _totalActiveStrategies += 1;
        return true;
    }

    function Unsubscribe(
        Strategy calldata strategy_
    ) external override returns (bool sucsess) {
        //Remove the given stragety from the list
        _totalActiveStrategies -= 1;
        _unSubscribeAccount(strategy_);
        return sucsess = true;
    }

    function Execute(
        Interval interval_
    ) external override onlyAdmins is_active inWindow(interval_) {
        _startIntervalExecution(interval_);
        emit ExecutedDCA(interval_);
    }

    function ForceFeeFund() external override onlyAdmins {}

    function GetTotalActiveStrategys() public view returns (uint256) {
        return _totalActiveStrategies;
    }

    function GetIntervalsStrategys(
        Interval interval_
    ) public view returns (Strategy[] memory) {
        return _strategies[interval_];
    }

    function GetSpesificStrategy(
        address dcaAccountAddress_,
        Interval interval_,
        uint256 accountStrategyId_
    ) public view returns (Strategy memory) {
        return
            _strategies[interval_][
                _localStratId[dcaAccountAddress_][accountStrategyId_]
            ];
    }

    function _subscribeAccount(Strategy memory strategy_) internal {
        uint256 id = _strategies[strategy_.interval].length;
        strategy_.active = true;
        _strategies[strategy_.interval].push(strategy_);
        _localStratId[strategy_.accountAddress][strategy_.strategyId] = id;
        emit DCAAccontSubscription(strategy_, true);
    }

    function _unSubscribeAccount(Strategy calldata strategy_) private {
        _removeStratageyFromArray(strategy_);
        emit DCAAccontSubscription(strategy_, true);
    }

    function _setExecutionAddress(address newExecutionEOA_) internal {
        _executionEOAAddress = newExecutionEOA_;

        emit ExecutionEOAAddressChange(newExecutionEOA_, msg.sender);
    }

    function _startIntervalExecution(Interval interval_) internal {
        Strategy[] memory intervalStrategies = _strategies[interval_];
        //  Meed to work out a more efficient way of doing this
        for (uint256 i = 0; i < intervalStrategies.length; i++) {
            if (intervalStrategies[i].active)
                _singleExecution(
                    intervalStrategies[i].accountAddress,
                    intervalStrategies[i].strategyId
                );
        }

        _lastExecution[interval_] = block.timestamp;
        _totalIntervalsExecuted += 1;
    }

    function _singleExecution(
        address accountAddress_,
        uint256 strategyId_
    ) private {
        IDCAAccount(accountAddress_).Execute(strategyId_, _feeData.feeAmount);
    }

    function _setIntervalBlockAmounts() internal {
        //  Set the interval block amounts
        IntervalTimings[Interval.TestInterval] = 20;
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }

    function _removeStratageyFromArray(Strategy memory strategy_) private {
        //  Get the index of the strategy to remove from the local store
        //  Get the last element in the array
        uint256 local = _localStratId[strategy_.accountAddress][
            strategy_.strategyId
        ];
        Strategy memory movingStrat = _strategies[strategy_.interval][
            _strategies[strategy_.interval].length - 1
        ];

        //  Check the strategy to remove isnt the last
        if (_strategies[strategy_.interval].length - 1 != local) {
            //  If its not, set as moved strat
            //  Update the moved strat local Id
            _strategies[strategy_.interval][local] = movingStrat;
            _localStratId[movingStrat.accountAddress][
                movingStrat.strategyId
            ] = local;
        }
        //  Remove the last element
        _strategies[strategy_.interval].pop();
    }
}
