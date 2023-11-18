// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./IDCADataStructures.sol";
import "./IDCAExecutor.sol";

interface IDCAAccount is IDCADataStructures {
    /**
     *
     * @param strategyId_ the id fo the executed strategy
     * @param amountIn_ amount received from the swap
     */
    event StrategyExecuted(
        uint256 indexed strategyId_,
        uint256 indexed amountIn_,
        bool reInvest_
    );
    event DCAExecutorChanged(address indexed newAddress_);
    event StrategySubscribed(
        uint256 indexed strategyId_,
        address indexed executor_
    );
    event StrategyUnsubscribed(uint256 indexed strategyId_);
    event NewStrategyCreated(uint256 indexed strategyId_);

    function Execute(uint256 strategyId_, uint16 feeAmount_) external;

    function SetupStrategy(
        Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToEcecutor_
    ) external;

    function SubscribeStrategy(uint256 strategyId_) external;

    function UnsubscribeStrategy(uint256 stratogyId) external;

    function FundAccount(address token_, uint256 amount_) external;

    function GetBaseBalance(address token_) external returns (uint256);

    function GetTargetBalance(address token_) external returns (uint256);

    function UnFundAccount(address token_, uint256 amount_) external;

    function WithdrawSavings(address token_, uint256 amount_) external;

    function SetStrategyReinvest(
        uint256 strategyId_,
        bool activate_,
        bytes memory callData_
    ) external;
}
