// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./IDCADataStructures.sol";

interface IDCAExecutor is IDCADataStructures {
    event ExecutionEOAAddressChange(address newExecutionEOA_, address changer_);
    event ExecutedDCA(Interval interval_);

    function Subscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Unsubscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Execute(Interval interval_) external;

    function ForceFeeFund() external;
}
