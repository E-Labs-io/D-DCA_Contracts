// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./DCADataStructures.sol";

interface IDCAExecturor is DCADataStructures {
    event ExecutionEOAAddressChange(address newExecutionEOA_, address changer_);
    event ExecutedDCA(Interval interval_);

    function Subscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Unsubscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Execute(Interval interval_) external returns (bool sucsess);

    function forceFeeFund() external payable;
}
