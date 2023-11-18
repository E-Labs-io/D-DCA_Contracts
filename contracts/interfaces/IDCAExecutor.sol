// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./IDCADataStructures.sol";

interface IDCAExecutor is IDCADataStructures {
    event ExecutionEOAAddressChange(
        address indexed newExecutionEOA_,
        address changer_
    );
    event ExecutedDCA(address indexed account_, uint256 indexed strategyId_);

    event DCAAccountSubscription(
        address DCAAccountAddress_,
        uint256 strategyId_,
        Interval strategyInterval_,
        bool active_
    );

    event FeesDistributed(address indexed token_, uint256 indexed amount_);

    function Subscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Unsubscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Execute(address DCAAccount_, uint256 strategyId_) external;

    function ExecuteBatch(
        address[] memory DCAAccount_,
        uint256[] memory strategyId_
    ) external;

    function DistributeFees(address tokenAddress) external;
}
