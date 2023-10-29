// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/DCADataStructures.sol";

contract DSAExecutor is Ownable, IDCAExecutor {
    //Mapping of all active strategy for the given interval
    mapping(Interval => Strategy[]) internal _strategies;
    //Mapping of interval times to the last execution block time
    mapping(Interval => uint256) internal _lastExecution;
    // Mapping of Interval enum to block amounts
    mapping(Interval => uint256) public IntervalTimings;

    FeeDistribution internal _feeData;
    bool public Active;
    address internal _executionAddress;

    modifier onlyExecutor() {
        require(
            msg.sender == _executionAddress,
            "Only the DCA Executioner can do that"
        );
        _;
    }
    modifier isActive() {
        require(Active, "DCA is on pause");
        _;
    }

    constructor(
        FeeDistrobution calldata feeDistrobution_,
        address executionEOA_
    ) {
        _feeData = feeDistrobution_;
        _setExecutionAddress(newExecutionEOA_);
        if (msg.value > 0) forceFeeFund();
        //  Set the interval block amounts
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }

    function Subscribe(Strategy strategy_) public returns (bool sucsess) {
        //Adds the DCA account to the given strategy interval list.
    }

    function Unsubscribe(Strategy strategy_) public returns (bool sucsess) {
        //Remove the given stragety from the list
    }

    function Execute(
        Interval interval_
    ) public onlyExecutor returns (bool sucsess) {
        //Trigger the execution of the given interval
        emit ExecutedDCA(interval_);
    }

    function forceFeeFund() public onlyAdmin {}

    function _setExecutionAddress(address newExecutionEOA_) internal {
        _executionAddress = newExecutionEOA_;
        emit ExecutionEOAAddressChange(newExecutionEOA_, msg.sender);
    }

    function _startIntervalExecution() internal {}

    function _singleExecution(Strategy strategy_) internal {
        IDCAAccount(strategy_.accountAddress).Execute(strategy_.strategyId);
    }
}
