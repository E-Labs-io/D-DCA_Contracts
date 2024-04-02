// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//DEV
import "hardhat/console.sol";

// PRODUCTION
import "../logic/AccountLogic.sol";

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
 *       Dollar Cost Average Contracts
 ************************************************
 *                  V0.6
 *  x.com/0xAtion
 *  x.com/e_labs_
 *  e-labs.co.uk
 *
 */

contract DCAAccount is DCAAccountLogic {
    using Strategies for uint256;
    using Strategies for Strategy;

    constructor(
        address executorAddress_,
        address swapRouter_,
        address owner_,
        address reinvestLibraryContract_
    ) Swap(swapRouter_) OnlyExecutor(owner_, executorAddress_) {
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
    ) external override onlyExecutor inWindow(strategyId_) returns (bool) {
        require(
            _strategies[strategyId_].isActive(),
            "DCAAccount : [Execute] Strategy is not active"
        );
        require(
            _baseBalances[_strategies[strategyId_].baseAddress()] >=
                _strategies[strategyId_].amount,
            "DCAAccount : [Execute] Base Balance too low"
        );
        return _executeDCATrade(strategyId_, feeAmount_);
    }

    /**
     * @dev Add a new strategy to the account
     *      Only the owner can call.
     * @param newStrategy_ teh data for the strategy, based on the Strategy Struct
     * @param seedFunds_  Amount of the based token to fund with, 0 for none
     * @param subscribeToExecutor_ Wether to subscribe to the executor at setup
     */
    function SetupStrategy(
        Strategy memory newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) external override onlyOwner {
        _newStrategy(newStrategy_);
        if (seedFunds_ > 0) {
            FundAccount(newStrategy_.baseAddress(), seedFunds_);
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
        //Add the given strategy, once checking there are funds
        //to the default DCAExecutor

        Strategy memory givenStrategy = _strategies[strategyId_];
        require(
            !givenStrategy.active,
            "DCAAccount : [SubscribeStrategy] Strategy is already Subscribed"
        );

        require(
            _baseBalances[givenStrategy.baseToken.tokenAddress] >=
                (givenStrategy.amount * 5),
            "DCAAccount : [SubscribeStrategy] Need to have 5 executions funded to subscribe"
        );
        _subscribeToExecutor(_strategies[strategyId_]);
    }

    /**
     * @dev Unsubscribes the given strategy from its executor
     * @param strategyId_ Strategy Id of the strategy to unsubscribe
     */
    function UnsubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        //remove the given strategy from its active executor
        require(
            _strategies[strategyId_].isActive(),
            "DCAAccount : [UnsubscribeStrategy] Strategy is already Unsubscribed"
        );
        _unsubscribeToExecutor(strategyId_);
    }

    /**
     * @dev Force unsubscribe the strategy from the executor
     * @notice used by the Executor to removed failing strategies/out of funds strategies.
     * @param strategyId_ Strategy Id of the strategy to unsubscribe
     */
    function ExecutorDeactivateStrategy(
        uint256 strategyId_
    ) external override onlyExecutor {
        Strategy memory oldStrategy = _strategies[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);
        _strategies[oldStrategy.strategyId].active = false;
        _totalActiveStrategies -= 1;

        emit StrategyUnsubscribed(strategyId_);
    }

    /**
     * @dev Fund the account with a base currency
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the token to deposit
     */
    function FundAccount(
        address token_,
        uint256 amount_
    ) public override onlyOwner {
        //Transfer the given amount of the given ERC20 token to the DCAAccount
        IERC20(token_).transferFrom(msg.sender, address(this), amount_);
        _baseBalances[token_] += amount_;
    }

    /**
     * @dev Unfund the account of a base currency
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the token to withdraw
     */
    function UnFundAccount(address token_, uint256 amount_) public onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(
            _baseBalances[token_] >= amount_,
            "DCAAccount : [UnFundAccount] Balance of token to low"
        );
        _baseBalances[token_] -= amount_;
        IERC20(token_).transfer(msg.sender, amount_);
    }

    /**
     * @dev Withdraws the given amount of the target token balance
     * @param token_ {address} The ERC20 token address
     * @param amount_ {uint256} Amount of the target token to withdraw
     */

    function WithdrawSavings(
        address token_,
        uint256 amount_
    ) external onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        // Need to add logic to work out if the funds have been reinvested

        require(
            _targetBalances[token_] >= amount_,
            "DCAAccount : [WithdrawSavings] Balance of token to low"
        );
        _targetBalances[token_] -= amount_;
        IERC20(token_).transfer(msg.sender, amount_);
    }

    function UnWindReinvest(uint256 strategyId_) public onlyOwner {
        uint256 balance = _reinvestLiquidityTokenBalance[strategyId_];
        require(
            balance > 0,
            "[DCAAccount] : UnWindReinvest -  No investment to unwind"
        );

        (uint256 amount, bool success) = _withdrawReinvest(
            strategyId_,
            _strategies[strategyId_].reinvest,
            balance
        );
        emit StrategyReinvestUnwound(strategyId_, amount, success);
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
     * @dev get the total cost per-block for all strategies using the base token
     * @param token_ {address} Base token address
     * @return {uint256} amount of the base token strategies use per block
     */
    function getBaseTokenCostPerBlock(
        address token_
    ) external view returns (uint256) {
        return _costPerBlock[token_];
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
    function _changeDefaultExecutor(address newAddress_) internal {
        require(_executor() != newAddress_, "Already using this DCA executor");

        _changeExecutorAddress(newAddress_);
    }

    /**
     * @notice Functions for Reinvest
     */

    /**
     * @dev Updates the contract holding the reinvest logic
     * @param newLibraryAddress_ address of the library contract to use
     */

    function changeDCAReinvestLibrary(
        address newLibraryAddress_
    ) public onlyOwner {
        _setReinvestAddress(newLibraryAddress_);
        emit DCAReinvestLibraryChanged(newLibraryAddress_);
    }

    function getAttachedReinvestLibraryVersion()
        public
        view
        returns (string memory)
    {
        return _getReinvestContract().getLibraryVersion();
    }

    function getAttachedReinvestLibraryAddress() public view returns (address) {
        return address(_getReinvestContract());
    }

    /**
     * @notice ONLY IN CONTRACT FOR DEVELOPMENT, WILL REMOVE ON PUBLIC DEPLOY
     * @param baseToken_ address of the basetoken
     * @param targetToken_ address of the target token
     * @param amount_ amount of the base token to swap into the target token
     */

    function SWAP(
        address baseToken_,
        address targetToken_,
        uint256 amount_
    ) public onlyOwner {
        _approveSwapSpend(baseToken_, amount_);
        _swap(baseToken_, targetToken_, amount_);
    }
}
