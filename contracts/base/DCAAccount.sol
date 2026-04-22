// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// PRODUCTION
import "../logic/AccountLogic.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

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

contract DCAAccount is DCAAccountLogic, ReentrancyGuard {
    using Strategies for uint256;
    using Strategies for Strategy;
    using SafeERC20 for IERC20;

    // Custom errors for gas optimization
    error StrategyNotActive();
    error InsufficientBalance(uint256 available, uint256 required);
    error StrategyAlreadySubscribed();
    error StrategyAlreadyUnsubscribed();
    error InsufficientFundsForSubscription(uint256 required, uint256 available);
    error TransferFailed();
    error EthTransferFailed(address to, uint256 amount);
    // V0.9 require(string) → custom errors
    error NoReinvestBalance();
    error ReinvestUnwindFailed();
    error ExecutorUnchanged();

    constructor(
        address executorAddress_,
        address swapRouter_,
        address quoter_,
        address owner_,
        address reinvestLibraryContract_
    ) Swap(swapRouter_, quoter_) OnlyExecutor(owner_, executorAddress_) {
        _setReinvestAddress(reinvestLibraryContract_);
    }

    fallback() external payable {}

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {}

    /**
     * @dev Executes the given strategy with the given fee amount.
     *      Can only be done by the executor.
     * @param strategyId_ the id of the strategy to execute
     * @param feeAmount_ the amount of fee to pay to the executor
     */
    function Execute(
        uint256 strategyId_,
        uint16 feeAmount_
    ) external override onlyExecutor inWindow(strategyId_) nonReentrant returns (bool) {
        if (!_strategies[strategyId_].isActive()) {
            revert StrategyNotActive();
        }
        if (_baseBalances[_strategies[strategyId_].baseAddress()] < _strategies[strategyId_].amount) {
            revert InsufficientBalance(
                _baseBalances[_strategies[strategyId_].baseAddress()],
                _strategies[strategyId_].amount
            );
        }
        return _executeDCATrade(strategyId_, feeAmount_);
    }

    /**
     * @dev Add a new strategy to the account
     *      Only the owner can call.
     * @param newStrategy_ the data for the strategy, based on the Strategy Struct
     * @param seedFunds_  Amount of the base token to fund with, 0 for none
     * @param subscribeToExecutor_ Whether to subscribe to the executor at setup
     */
    function SetupStrategy(
        Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) external override onlyOwner {
        _newStrategy(newStrategy_);
        if (seedFunds_ > 0) {
            AddFunds(newStrategy_.baseAddress(), seedFunds_);
        }
        if (subscribeToExecutor_) {
            _subscribeToExecutor(newStrategy_);
        }
    }

    /**
     * @dev Subscribes an already created strategy to an executor
     * @param strategyId_ {uint256} Id of the strategy to subscribe to an executor
     */
    function SubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        // Add the given strategy, once checking there are funds
        // to the default DCAExecutor

        Strategy memory givenStrategy = _strategies[strategyId_];
        if (givenStrategy.active) {
            revert StrategyAlreadySubscribed();
        }

        if (_baseBalances[givenStrategy.baseToken.tokenAddress] < (givenStrategy.amount * 5)) {
            revert InsufficientFundsForSubscription(
                givenStrategy.amount * 5,
                _baseBalances[givenStrategy.baseToken.tokenAddress]
            );
        }
        _subscribeToExecutor(_strategies[strategyId_]);
    }

    /**
     * @dev Unsubscribes the given strategy from its executor
     * @param strategyId_ Strategy Id of the strategy to unsubscribe
     */
    function UnsubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        // Remove the given strategy from its active executor
        if (!_strategies[strategyId_].isActive()) {
            revert StrategyAlreadyUnsubscribed();
        }
        _unsubscribeToExecutor(strategyId_);
    }

    /**
     * @dev Force unsubscribe the strategy from the executor
     * @notice used by the Executor to remove failing strategies/out of funds strategies.
     * @param strategyId_ Strategy Id of the strategy to unsubscribe
     */
    function ExecutorDeactivate(
        uint256 strategyId_
    ) external override onlyExecutor {
        _strategies[strategyId_].active = false;
        _totalActiveStrategies -= 1;

        emit StrategySubscription(strategyId_, _executor(), false);
    }

    /**
     * @dev Fund the account with a base currency
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the token to deposit
     */
    function AddFunds(
        address token_,
        uint256 amount_
    ) public override onlyOwner nonReentrant {
        //Transfer the given amount of the given ERC20 token to the DCAAccount
        IERC20(token_).safeTransferFrom(msg.sender, address(this), amount_);
        _baseBalances[token_] += amount_;
    }

    /**
     * @dev Unfund account of a base token
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the token to withdraw
     */
    function WithdrawFunds(address token_, uint256 amount_) public onlyOwner nonReentrant {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        if (_baseBalances[token_] < amount_) {
            revert InsufficientBalance(_baseBalances[token_], amount_);
        }
        _baseBalances[token_] -= amount_;
        IERC20(token_).safeTransfer(msg.sender, amount_);
    }

    /**
     * @dev Withdraws the given amount of the target token balance
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the target token to withdraw
     */

    function WithdrawSavings(
        address token_,
        uint256 amount_
    ) external override onlyOwner nonReentrant {
        if (_targetBalances[token_] < amount_) {
            revert InsufficientBalance(_targetBalances[token_], amount_);
        }
        _targetBalances[token_] -= amount_;
        if (token_ == address(0)) {
            // Use call{value} rather than .transfer — .transfer forwards
            // only 2300 gas which breaks when the recipient is a contract
            // with any non-trivial fallback (e.g. Safe multisigs).
            (bool ok, ) = payable(msg.sender).call{value: amount_}("");
            if (!ok) revert EthTransferFailed(msg.sender, amount_);
        } else {
            IERC20(token_).safeTransfer(msg.sender, amount_);
        }
    }

    /**
     * @dev Unwinds the reinvestment for the given strategy
     * @notice repays the underlining token and return the target token
     * @param strategyId_ The id of the strategy to unwind
     */
    function UnwindReinvest(
        uint256 strategyId_
    ) public onlyOwner returns (uint256 amountOfTargetReturned) {
        Strategy memory strategy = _strategies[strategyId_];
        if (!strategy.active) revert StrategyNotActive();

        uint256 balance = _reinvestLiquidityTokenBalance[strategyId_];
        if (balance == 0) revert NoReinvestBalance();

        bool success;
        (amountOfTargetReturned, success) = _withdrawReinvest(
            strategyId_,
            strategy.reinvest,
            balance
        );
        if (!success) revert ReinvestUnwindFailed();

        emit ReinvestUnwound(strategyId_, amountOfTargetReturned);
    }

    function ForceUnwindReinvestPosition(
        uint256 strategyId_,
        address liquidityToken_
    ) public onlyOwner returns (uint256 amountOfTargetReturned) {
        Strategy memory strategy = _strategies[strategyId_];
        if (!strategy.active) revert StrategyNotActive();

        bool success;
        (amountOfTargetReturned, success) = _forceWithdrawReinvest(
            strategy.reinvest,
            liquidityToken_
        );

        // Update target balance
        _targetBalances[
            strategy.targetToken.tokenAddress
        ] += amountOfTargetReturned;

        if (!success) revert ReinvestUnwindFailed();
        emit ReinvestUnwound(strategyId_, amountOfTargetReturned);
    }

    /**
     * @dev Set or remove reinvest data for a strategy
     * @notice Ref to the Reinvest library for more info
     * @param strategyId_ Strategy Id of the strategy to amend
     * @param reinvest_ {Reinvest} the reinvest data to assign to the strategy.  Can set active to false to remove reinvest
     */
    function setStrategyReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_ //bool migrateOrWithdrawCurrentReinvest_
    ) external override onlyOwner {
        /**
         * @dev
         * Need to add check for already active reinvest
         * Will need to remove or transfer to new reinvest
         */
        if (reinvest_.active) {
            _strategies[strategyId_].reinvest = reinvest_;
        } else
            _strategies[strategyId_].reinvest = Reinvest(
                new bytes(0),
                false,
                0x00,
                address(this)
            );
    }

    /**
     * @dev Updates the Uniswap SwapRouter Address
     * @notice current swap functionality only allowing for Uniswap
     * @param swapRouter_  New address for the Uniswap router
     */
    function updateSwapAddress(address swapRouter_) public onlyOwner {
        _updateSwapAddress(swapRouter_);
    }

    /**
     * @dev get account balance of base token
     * @param token_ {address} Base token address
     * @return {uint256} account balance of Base token
     */
    function getBaseBalance(
        address token_
    ) external view override returns (uint256) {
        return _baseBalances[token_];
    }

    /**
     * @dev get account balance of target token
     * @param token_ {address} Base token address
     * @return {uint256} account balance of Base token
     */
    function getTargetBalance(
        address token_
    ) external view override returns (uint256) {
        return _targetBalances[token_];
    }

    /**
     * @dev Get the full data for the given strategy
     * @param strategyId_ Strategy Id of the strategy data to get
     * @return {Strategy} the given strategy's full data struct
     */
    function getStrategyData(
        uint256 strategyId_
    ) external view returns (Strategy memory) {
        return _strategies[strategyId_];
    }

    /**
     * @dev update the onChain executor address
     * @param newAddress_ address of the new default executor contract
     */
    function _changeExecutor(address newAddress_) internal {
        if (_executor() == newAddress_) revert ExecutorUnchanged();
        _changeExecutorAddress(newAddress_);
    }

    /**
     * @notice Functions for Reinvest
     */

    /**
     * @dev Updates the contract holding the reinvest logic
     * @param newLibraryAddress_ address of the library contract to use
     */
    function changeReinvestLibrary(
        address newLibraryAddress_
    ) public onlyOwner {
        _setReinvestAddress(newLibraryAddress_);
    }

    /**
     * @dev Batch subscribe multiple strategies to the executor
     * @param strategyIds_ Array of strategy IDs to subscribe
     */
    function batchSubscribeStrategies(
        uint256[] calldata strategyIds_
    ) external onlyOwner {
        for (uint256 i = 0; i < strategyIds_.length; i++) {
            uint256 strategyId = strategyIds_[i];
            Strategy memory givenStrategy = _strategies[strategyId];

            if (!givenStrategy.active &&
                _baseBalances[givenStrategy.baseToken.tokenAddress] >= (givenStrategy.amount * 5)) {
                _subscribeToExecutor(_strategies[strategyId]);
            }
        }
    }

    /**
     * @dev Batch unsubscribe multiple strategies from the executor
     * @param strategyIds_ Array of strategy IDs to unsubscribe
     */
    function batchUnsubscribeStrategies(
        uint256[] calldata strategyIds_
    ) external onlyOwner {
        for (uint256 i = 0; i < strategyIds_.length; i++) {
            uint256 strategyId = strategyIds_[i];
            if (_strategies[strategyId].isActive()) {
                _unsubscribeToExecutor(strategyId);
            }
        }
    }

    /**
     * @dev Returns the version of the attached reinvest library
     * @return The version of the attached reinvest library
     */
    function getAttachedReinvestLibraryVersion()
        public
        view
        returns (string memory)
    {
        return _getReinvestContract().getLibraryVersion();
    }

    /**
     * @dev Returns the address of the attached reinvest library
     * @return The address of the attached reinvest library
     */
    function getAttachedReinvestLibraryAddress() public view returns (address) {
        return address(_getReinvestContract());
    }
}
