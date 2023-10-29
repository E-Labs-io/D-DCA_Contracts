// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDCAExecutor.sol";
import "./interfaces/IDCAAccount.sol";
import "./security/onlyAdmin.sol";

contract DCAExecutor is OnlyAdmin, IDCAExecutor {
    //Mapping of all active strategy for the given interval
    mapping(Interval => Strategy[]) internal _strategies;
    //Mapping of interval times to the last execution block time
    mapping(Interval => uint256) internal _lastExecution;
    // Mapping of Interval enum to block amounts
    mapping(Interval => uint256) public IntervalTimings;

    FeeDistribution internal _feeData;
    bool public Active = true;
    address internal _executionEOAAddress;

    uint256 private _totalActiveStrategies;
    uint256 private _totalIntervalsExecuted;

    modifier isActive() {
        require(Active, "DCA is on pause");
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
        //  Set the interval block amounts
        IntervalTimings[Interval.TestInterval] = 20;
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }

    function Subscribe(
        Strategy calldata strategy_
    ) public override isActive returns (bool sucsess) {
        //Adds the DCA account to the given strategy interval list.
        _totalActiveStrategies += 1;

        return sucsess = true;
    }

    function Unsubscribe(
        Strategy calldata strategy_
    ) public override returns (bool sucsess) {
        //Remove the given stragety from the list
        _totalActiveStrategies -= 1;

        return sucsess = true;
    }

    function Execute(
        Interval interval_
    ) public override onlyAdmins isActive inWindow(interval_) {
        _startIntervalExecution(interval_);
        //Trigger the execution of the given interval
        emit ExecutedDCA(interval_);
    }

    function ForceFeeFund() public override onlyAdmins {}

    function _setExecutionAddress(address newExecutionEOA_) internal {
        _executionEOAAddress = newExecutionEOA_;

        emit ExecutionEOAAddressChange(newExecutionEOA_, msg.sender);
    }

    function _startIntervalExecution(Interval interval_) private {
        Strategy[] memory intervalStrategies = _strategies[interval_];

        //  Meed to work out a more efficient way of doing this
        for (uint i = 0; i < intervalStrategies.length; i++) {
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
        uint strategyId_
    ) private {
        IDCAAccount(accountAddress_).Execute(strategyId_, _feeData.feeAmount);
    }
}
