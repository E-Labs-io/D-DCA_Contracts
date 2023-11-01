// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./IDCADataStructures.sol";
import "./IDCAExecutor.sol";

interface IDCAAccount is IDCADataStructures {
    event StratogyExecuted(uint256 indexed strategyId_);
    event DCAExecutorChanged(address newAddress_);
    event StrategySubscribed(uint256 strategyId_, address executor_);
    event StrategyUnsubscribed(uint256 strategyId_);

    function Execute(uint256 strategyId_, uint256 feeAmount_) external;

    function SetupStrategy(
        Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToEcecutor_
    ) external;

    function SubscribeStrategy(
        uint256 strategyId_
    ) external;

    function UnsubscribeStrategy(
        uint256 stratogyId
    ) external;

    function FundAccount(IERC20 token_, uint256 amount_) external;

    function GetBaseBalance(IERC20 token_) external returns (uint256);

    function GetTargetBalance(IERC20 token_) external returns (uint256);

    function UnFundAccount(IERC20 token_, uint256 amount_) external;

    function WithdrawSavings(IERC20 token_, uint256 amount_) external;
}
