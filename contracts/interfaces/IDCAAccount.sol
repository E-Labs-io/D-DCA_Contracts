// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./IDCADataStructures.sol";
import "./IDCAExecutor.sol";

interface IDCAAccount is IDCADataStructures {
    /**
     * @notice Emitted when a strategy has been executed
     * @param strategyId_ {uint256} the id for the executed strategy
     * @param amountIn_ {uint256} amount received from the swap
     * @param reInvest_ {bool} wether the strategy reinvested or not
     */
    event StrategyExecuted(
        uint256 indexed strategyId_,
        uint256 indexed amountIn_,
        bool reInvest_
    );

    /**
     * @notice Emitted when the Strategy is confirmed to be subscribed to an Executor
     * @param strategyId_ {uint256} ID of the strategy that has been subscribed
     * @param executor_ {address} Address of the Executor contract subscribed to
     */
    event StrategySubscribed(
        uint256 indexed strategyId_,
        address indexed executor_
    );
    /**
     * @notice Emitted when a strategy has been unsubscribed from an Executor
     * @param strategyId_ {uint256} Id of the strategy being unsubscribed
     */
    event StrategyUnsubscribed(uint256 indexed strategyId_);
    /**
     * @notice Emitted when a new strategy has been created
     * @param strategyId_ {uint256} Id of the newly created strategy
     */
    event NewStrategyCreated(uint256 indexed strategyId_);

    event DCAReinvestLibraryChanged(address indexed newLibraryAddress);

    event StrategyReinvestExecuted(
        uint256 indexed strategyId_,
        bool indexed success
    );

    event StrategyReinvestUnwound(
        uint256 indexed strategyId,
        uint256 amount,
        bool indexed success
    );

    /**
     * @notice Triggered by the assigned executor to execute the given strategy
     * @param strategyId_ {uint256} Id for the Strategy to be executed
     * @param feeAmount_ (uint16) amount of the strategy amount to be paid via fee (percent)
     * @return If the function was successful
     */
    function Execute(
        uint256 strategyId_,
        uint16 feeAmount_
    ) external returns (bool);

    /**
     * @notice Used by the account owner to setup a new strategy
     * @param newStrategy_ {Strategy} Strategy data for the new strategy to be created from
     * @param seedFunds_ {uin256} amount of the base token to fun the subscription with
     * @dev if no seed fund set to 0.  Any seed funds will need to be approved before this function is called
     * @param subscribeToExecutor_ {bool} wether to auto subscribe to the default executor
     * @dev the Account needs to have 5 executions worth of funds to be subscribed
     */
    function SetupStrategy(
        IDCADataStructures.Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) external;

    /**
     * @notice Used by the account owner to subscribe the strategy to the executor
     * @param strategyId_ {uint256} The Id of the strategy to subscribe to the executor
     */
    function SubscribeStrategy(uint256 strategyId_) external;

    /**
     * @notice Used by the account owner to unsubscribe the strategy to the executor
     * @param strategyId_ {uint256} ID of the strategy to unsubscribe
     */
    function UnsubscribeStrategy(uint256 strategyId_) external;

    /**
     * @notice Allows the account owner to fund the account for strategy's
     * @dev the funds are not strategy specific
     * @param token_ {address} Address for the base token being funded
     * @param amount_ {uint256} Amount of the token to be deposited
     * @dev Must approve the spend before calling this function
     */

    function FundAccount(address token_, uint256 amount_) external;

    /**
     * @notice Removes a given amount from the Address of the given base token
     * @param token_ {address} Address of the base token to remove from the contract
     * @param amount_ {uint256} Amount of the base token to remove from the address
     */
    function UnFundAccount(address token_, uint256 amount_) external;

    /**
     * @notice Removes a given amount from the Address of the given target token
     * @param token_ {address} Address of the target token to remove from the account
     * @param amount_ {uint256} Amount of the target token to remove from the account
     */
    function WithdrawSavings(address token_, uint256 amount_) external;

    /**
     * @notice Ony callable by the DCAExecutor contract to remove the strategy from the executor
     * @dev used when a strategy runs out of funds to execute
     * @param strategyId_ {uint256} Id of the strategy to remove
     */
    function ExecutorDeactivateStrategy(uint256 strategyId_) external;

    /**
     * @notice Allows the account owner to set, remove and update a strategy reinvest
     * @param strategyId_ {uint256} Id of the strategy
     * @param reinvest_ {Reinvest} Reinvest data to amend
     */
    function setStrategyReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_
    ) external;

    /**
     * @notice Gets Account balance of the provided base token
     * @param token_ {address} Address for the token to check
     * @return {uint256} Amount of that token in the account
     */
    function getBaseBalance(address token_) external returns (uint256);

    /**
     * @notice Gets Account balance of the provided target token
     * @param token_ {address} Address for the token to check
     * @return {uint256} Amount of that token in the account
     */
    function getTargetBalance(address token_) external returns (uint256);
}
