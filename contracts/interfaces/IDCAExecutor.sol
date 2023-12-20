// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./IDCADataStructures.sol";

interface IDCAExecutor is IDCADataStructures {
    /**
     * @notice emitted when the default Executor service address is changed
     * @param newExecutionEOA_ {address} the new address of the Executor Service EOA or Multi
     * @param changer_ {address} address of the wallet implementing change
     */
    event ExecutionEOAAddressChange(
        address indexed newExecutionEOA_,
        address changer_
    );

    /**
     * @notice Emitted once a strategy has finished executing
     * @param account_ {address} Address of the DCAAccount
     * @param strategyId_ {uint256} ID of teh strategy executed
     */
    event ExecutedDCA(address indexed account_, uint256 indexed strategyId_);

    /**
     * @notice Emitted when a new strategy subscribes or unsubscribes to the executor
     * @param DCAAccountAddress_ {address} address of the DCAAccount subscribing
     * @param strategyId_ {uint256} ID of the strategy to (un-)subscribe
     * @param strategyInterval_ {Interval} Interval state of how ofter to be executed
     * @param active_ {bool} wether the strategy is being subscribed (true) or unsubscribed (false)
     */
    event DCAAccountSubscription(
        address indexed DCAAccountAddress_,
        uint256 indexed strategyId_,
        Interval strategyInterval_,
        bool indexed active_
    );

    /**
     * @notice Emitted each time the protocol fees are distributed
     * @param token_ {address} address of the token being distributed
     * @param amount_ {uint256} amount of the total token distributed
     */
    event FeesDistributed(address indexed token_, uint256 indexed amount_);

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
        uint256 strategyId_
    ) external;

    /**
     * @notice Called by the external Executor service wallet only, triggers the specified strategy
     * @param DCAAccount_ {address} Address of the DCAAccount holding the strategy to execute
     * @param strategyId_ {uint256} ID of the strategy to execute
     */
    function Execute(address DCAAccount_, uint256 strategyId_) external;

    /**
     * @notice Called by the external Executor service wallet only, triggers the specified strategy's
     * @dev testing for now, will execute a max of 10 strategies at a time
     * @param DCAAccount_ {address[]} Address of the DCAAccount holding the strategy to execute
     * @param strategyId_ {uint256[]} ID of the strategy to execute
     */

    function ExecuteBatch(
        address[] memory DCAAccount_,
        uint256[] memory strategyId_
    ) external;

    /**
     * @notice Distributes the acuminated fee's from the DCAExecutor
     * @dev will use the in-contract fee's data to split the funds and transfer to needed wallets.
     * @param tokenAddress {address} Address of the token in the fee's pool to be distributed
     */
    function DistributeFees(address tokenAddress) external;

    /**
     * @notice Used by the Executor service to remove a strategy from the DCAExecutor
     *      Used mostly for unfunded and failing accounts.
     * @param DCAAccount_ {address} Address of the DCAAccount to be unsubscribed
     * @param strategyId_ {uint256} ID of the strategy to be unsubscribed
     */
    function ForceUnsubscribe(
        address DCAAccount_,
        uint256 strategyId_
    ) external;
}
