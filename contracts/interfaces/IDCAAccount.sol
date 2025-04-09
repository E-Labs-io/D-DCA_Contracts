// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./IDCADataStructures.sol";
/**
 *
 ************************************************
 *____ooo____oooooooo_oooo____oooo____ooo____oo_*
 *__oo___oo_____oo_____oo___oo____oo__oooo___oo_*
 *_oo_____oo____oo_____oo__oo______oo_oo_oo__oo_*
 *_ooooooooo____oo_____oo__oo______oo_oo__oo_oo_*
 *_oo_____oo____oo_____oo___oo____oo__oo___oooo_*
 *_oo_____oo____oo____oooo____oooo____oo____ooo_*
 *______________________________________________*
 *      Distributed Cost Average Contracts
 ************************************************
 *                  V0.7
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */
interface IDCAAccount is IDCADataStructures {
    /**
     * @notice Emitted when a strategy has been executed
     * @param strategyId_ the id for the executed strategy
     * @param amountIn_ amount received from the swap
     * @param reInvested_  wether the strategy reinvested or not
     */
    event StrategyExecuted(
        uint256 indexed strategyId_,
        uint256 indexed amountIn_,
        bool reInvested_
    );
    /**
     * @notice Emitted when the Strategy is confirmed to be subscribed to an Executor
     * @param strategyId_ ID of the strategy that has been subscribed
     * @param executor_ Address of the Executor contract subscribed to
     * @param subscribed_ Wether the strategy is subscribed/unsubscribed to the executor
     */
    event StrategySubscription(
        uint256 indexed strategyId_,
        address indexed executor_,
        bool indexed subscribed_
    );
    /**
     * @notice Emitted when a new strategy has been created
     * @param strategyId_ Id of the newly created strategy
     */
    event StrategyCreated(uint256 indexed strategyId_);
    /**
     * @notice Emits when the reinvest address has been changed
     * @param newLibraryAddress The address for the Library contract
     */
    event ReinvestLibraryChanged(address indexed newLibraryAddress);

    /**
     * @notice Emits when a Reinvest modula has been executed
     * @param strategyId_ the ID of the strategy executed
     * @param success Wether the reinvest was successful
     * @param amountReturned The amount returned by the Reinvest
     */
    event ReinvestExecuted(
        uint256 indexed strategyId_,
        bool indexed success,
        uint256 amountReturned
    );

    /**
     * @notice Emited when a Reinvest is unwound
     * @param strategyId The ID of the strategy
     * @param amount The amount unwond and returned to the account
     * @param success If the unwind was successful
     */
    event ReinvestUnwound(
        uint256 indexed strategyId,
        uint256 amount,
        bool indexed success
    );

    /**
     * @notice Triggered by the assigned executor to execute the given strategy
     * @param strategyId_  Id for the Strategy to be executed
     * @param feeAmount_ amount of the strategy amount to be paid via fee (percent)
     * @return If the function was successful
     */
    function Execute(
        uint256 strategyId_,
        uint16 feeAmount_
    ) external returns (bool);

    /**
     * @notice Used by the account owner to setup a new strategy
     * @param newStrategy_  Strategy data for the new strategy to be created from
     * @param seedFunds_ amount of the base token to fund the strategy with now (optional)
     * @dev if no seed fund set to 0.  Any seed funds will need to be approved before this function is called
     * @param subscribeToExecutor_  wether to auto subscribe to the default executor
     * @dev the Account needs to have 5 executions worth of funds to be subscribed
     */
    function SetupStrategy(
        IDCADataStructures.Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) external;

    /**
     * @notice Used by the account owner to subscribe the strategy to the executor
     * @param strategyId_ The Id of the strategy to subscribe to the executor
     * @dev the Account needs to have 5 executions worth of funds to be subscribed
     */
    function SubscribeStrategy(uint256 strategyId_) external;

    /**
     * @notice Used by the account owner to unsubscribe the strategy to the executor
     * @param strategyId_ ID of the strategy to unsubscribe
     */
    function UnsubscribeStrategy(uint256 strategyId_) external;

    /**
     * @notice Allows the account owner to fund the account for strategy's
     * @dev the funds are not strategy specific
     * @param token_ Address for the base token being funded
     * @param amount_ Amount of the token to be deposited
     * @dev Must approve the spend before calling this function
     */

    function AddFunds(address token_, uint256 amount_) external;

    /**
     * @notice Removes a given amount from the Address of the given base token
     * @param token_ Address of the base token to remove from the contract
     * @param amount_ Amount of the base token to remove from the address
     */
    function WithdrawFunds(address token_, uint256 amount_) external;

    /**
     * @notice Removes a given amount from the Address of the given target token
     * @param token_ Address of the target token to remove from the account
     * @param amount_ Amount of the target token to remove from the account
     */
    function WithdrawSavings(address token_, uint256 amount_) external;

    /**
     * @notice Ony callable by the DCAExecutor contract to remove the strategy from the executor
     * @dev used when a strategy runs out of funds to execute
     * @param strategyId_ Id of the strategy to remove
     */
    function ExecutorDeactivate(uint256 strategyId_) external;

    /**
     * @notice Allows the account owner to set, remove and update a strategy reinvest
     * @param strategyId_ Id of the strategy
     * @param reinvest_ Reinvest data to amend
     */
    function setStrategyReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_
    ) external;

    /**
     * @notice Gets Account balance of the provided base token
     * @param token_ Address for the token to check
     * @return Amount of that token in the account
     */
    function getBaseBalance(address token_) external returns (uint256);

    /**
     * @notice Gets Account balance of the provided target token
     * @param token_ Address for the token to check
     * @return Amount of that token in the account
     */
    function getTargetBalance(address token_) external returns (uint256);

    /**
     *
     * @param strategyId_ The ID of the strategy to check
     * @return lastEx Timestamp of the last execution of the given strategy
     * @return secondsLeft Seconds left till the window for the strategys next execution
     * @return checkReturn
     */
    function getTimeTillWindow(
        uint256 strategyId_
    )
        external
        view
        returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn);
}
