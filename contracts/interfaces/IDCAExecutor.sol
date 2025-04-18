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
interface IDCAExecutor is IDCADataStructures {
    /**
     * @notice Emitted once a strategy has finished executing successfully
     * @param account_ Address of the DCAAccount
     * @param strategyId_  ID of the strategy executed
     */
    event ExecutedStrategy(
        address indexed account_,
        uint256 indexed strategyId_
    );

    /**
     * @notice Emitted when a new strategy subscribes or unsubscribes to the executor
     * @param DCAAccountAddress_  address of the DCAAccount subscribing
     * @param strategyId_  ID of the strategy to (un-)subscribe
     * @param strategyInterval_  Interval state of how ofter to be executed
     * @param active_ wether the strategy is being subscribed (true) or unsubscribed (false)
     */
    event StrategySubscription(
        address indexed DCAAccountAddress_,
        uint256 indexed strategyId_,
        Interval strategyInterval_,
        bool indexed active_
    );

    /**
     * @notice Emitted each time the protocol fees are distributed
     * @param token_ address of the token being distributed
     * @param amount_ amount of the total token distributed
     */
    event FeesDistributed(address indexed token_, uint256 indexed amount_);

    event FeeDataChanged();

    event BaseTokenAllowanceChanged(address token_, bool allowed_);
    error NotAllowedBaseToken(address token_);

    /**
     * @notice Called by a DCAAccount to subscribe a strategy to the DCAExecutor
     * @param strategy_ The full strategy data of the subscribing strategy
     */
    function Subscribe(Strategy calldata strategy_) external;

    /**
     * @notice Called by the DCAAccount to remove itself from the executor
     * @param DCAAccountAddress_ Address of the unsubscribing DCAAccount
     * @param strategyId_ ID of the strategy being unsubscribed
     */
    function Unsubscribe(
        address DCAAccountAddress_,
        uint256 strategyId_,
        Interval interval_
    ) external;

    /**
     * @notice Called by the external Executor service wallet only, triggers the specified strategy
     * @param DCAAccount_ {address} Address of the DCAAccount holding the strategy to execute
     * @param strategyId_ {uint256} ID of the strategy to execute
     * @param interval_ {Interval} Interval of the strategy to execute
     */
    function Execute(
        address DCAAccount_,
        uint256 strategyId_,
        Interval interval_
    ) external;

    /**
     * @notice Distributes the acuminated fee's from the DCAExecutor
     * @dev will use the in-contract fee's data to split the funds and transfer to needed wallets.
     * @param tokenAddress {address} Address of the token in the fee's pool to be distributed
     */
    function DistributeFees(address tokenAddress) external;

    /**
     * @notice Used by the Executor service to remove a strategy from the DCAExecutor
     * Used mostly for unfunded and failing accounts.
     * @param DCAAccount_ {address} Address of the DCAAccount to be unsubscribed
     * @param strategyId_ {uint256} ID of the strategy to be unsubscribed
     */
    function ForceUnsubscribe(
        address DCAAccount_,
        uint256 strategyId_,
        Interval interval_
    ) external;

    function getTimeTillWindow(
        address account_,
        uint256 strategyId_
    )
        external
        view
        returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn);

    /**
     * @notice Allows the admin to turn Strategy timings on & off
     * @param interval_ The strategy interval
     * @param status_ if the interval is active or not
     */
    function setIntervalActive(Interval interval_, bool status_) external;

    function setBaseTokenAllowance(address token_, bool allowed_) external;
}
