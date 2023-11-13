// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import "./interfaces/IDCADataStructures.sol";
import "./interfaces/IDCAAccount.sol";
import "./interfaces/IDCAExecutor.sol";
import "./security/onlyExecutor.sol";

contract DCAAccount is OnlyExecutor, IDCAAccount {
    mapping(uint256 => Strategy) private _strategies;

    mapping(address => uint256) private _baseBalances;
    mapping(address => uint256) private _targetBalances;

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(address => uint256) internal _costPerBlock; //  Base currency

    // Mapping of Interval enum to block amounts
    // Should move to a library using constants
    mapping(Interval => uint256) public IntervalTimings;

    IDCAExecutor internal _executorAddress;
    ISwapRouter immutable SWAP_ROUTER;

    uint24 private _poolFee = 10000;

    uint256 private _totalIntervalsExecuted;
    uint256 private _totalActiveStrategies;
    uint256 private _strategyCount;

    constructor(
        address executorAddress_,
        address swapRouter_,
        address owner_
    ) OnlyExecutor(executorAddress_) Ownable(owner_) {
        _changeDefaultExecutor(IDCAExecutor(executorAddress_));
        SWAP_ROUTER = ISwapRouter(swapRouter_);

        IntervalTimings[Interval.TestInterval] = 20;
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }

    modifier inWindow(uint256 strategyId_) {
        require(
            _lastExecution[strategyId_] +
                IntervalTimings[_strategies[strategyId_].interval] <
                block.timestamp,
            "DCA Interval not met"
        );
        _;
    }

    /**
     * @dev swaps from base token for set amount into any amount of target token
     * @notice ONLY FOR DEVELOPMENT
     * @param baseToken_ {address}  token address of the token to swap from
     * @param targetToken_ {address} token address of the token to recieve
     * @param amount_ {uint256} amount returned from the swap
     */

    function TestSwap(
        address baseToken_,
        address targetToken_,
        uint256 amount_
    ) external onlyOwner {
        _approveSwapSpend(baseToken_, amount_);
        _swap(baseToken_, targetToken_, amount_);
    }

    /**
     * @dev Executes the given strategy with the given fee amount.
     *      Can only be done by the executor.
     * @param strategyId_ the id of the strategy to execute
     * @param feeAmount_ the amount of fee to pay to the executor
     */
    // Public Functions
    function Execute(
        uint256 strategyId_,
        uint16 feeAmount_
    ) external override onlyExecutor inWindow(strategyId_) {
        require(_strategies[strategyId_].active, "Strategy is not active");
        _executeDCATrade(strategyId_, feeAmount_);
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
        _strategyCount++;
        //Adds a new strategy to the system
        //Transfers the given amount of the base token to the account
        //If true subscribes the strategy to the default executor
        newStrategy_.strategyId = _strategyCount;
        newStrategy_.accountAddress = address(this);
        newStrategy_.active = false;
        _strategies[_strategyCount] = newStrategy_;

        if (seedFunds_ > 0)
            FundAccount(newStrategy_.baseToken.tokenAddress, seedFunds_);
        if (subscribeToExecutor_) _subscribeToExecutor(newStrategy_);
        _strategyCount++;
    }

    function SubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        //Add the given strategy, once checking there are funds
        //to the default DCAExecutor
        require(
            !_strategies[strategyId_].active,
            "Strategy is already Subscribed"
        );
        _subscribeToExecutor(_strategies[strategyId_]);
    }

    function UnsubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        //remove the given strategy from its active executor
        require(
            _strategies[strategyId_].active,
            "Strategy is already Unsubscribed"
        );
        _unsubscribeToExecutor(strategyId_);
    }

    function ExecutorDeactivateStrategy(
        uint256 strategyId_
    ) external onlyExecutor {
        Strategy memory oldStrategy = _strategies[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);
        _strategies[oldStrategy.strategyId].active = false;
        _totalActiveStrategies -= 1;

        emit StrategyUnsubscribed(oldStrategy.strategyId);
    }

    function FundAccount(
        address token_,
        uint256 amount_
    ) public override onlyOwner {
        //Transfer the given amount of the given ERC20 token to the DCAAccount
        IERC20(token_).transferFrom(msg.sender, address(this), amount_);
        _baseBalances[token_] += amount_;
    }

    function UnFundAccount(address token_, uint256 amount_) public onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(_baseBalances[token_] >= amount_, "Balance of token to low");
        IERC20(token_).transfer(msg.sender, amount_);
        _baseBalances[token_] -= amount_;
    }

    function WithdrawSavings(
        address token_,
        uint256 amount_
    ) external onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(_targetBalances[token_] >= amount_, "Balance of token to low");
        IERC20(token_).transfer(msg.sender, amount_);
        _targetBalances[token_] -= amount_;
    }

    function SetStrategyReinvest(
        uint256 strategyId_,
        bool activate_,
        bytes memory callData_
    ) external override {
        if (activate_) {
            _strategies[strategyId_].reinvest = true;
            _strategies[strategyId_].reinvestCallData = callData_;
        } else {
            _strategies[strategyId_].reinvest = false;
        }
    }

    function GetBaseTokenCostPerBlock(
        address baseToken_
    ) external view returns (uint256) {
        return _costPerBlock[baseToken_];
    }

    function GetBaseTokenRemainingBlocks(
        address baseToken_
    ) external view returns (uint256) {
        return _baseBalances[baseToken_] / _costPerBlock[baseToken_];
    }

    function GetBaseBalance(
        address token_
    ) external view override returns (uint256) {
        return _baseBalances[token_];
    }

    function GetTargetBalance(
        address token_
    ) external view override returns (uint256) {
        return _targetBalances[token_];
    }

    function GetStrategyData(
        uint256 strategyId_
    ) external view returns (Strategy memory) {
        return _strategies[strategyId_];
    }

    // Internal & Private functions
    function _executeDCATrade(uint256 strategyId_, uint16 feeAmount_) internal {
        //Example of how this might work using Uniswap
        //Get the stragegy
        Strategy memory selectedStrat = _strategies[strategyId_];
        address baseToken = selectedStrat.baseToken.tokenAddress;
        address targetToken = selectedStrat.targetToken.tokenAddress;
        uint256 feeAmount = 0;
        uint256 tradeAmount = 0;
        uint256 amountIn = 0;

        //Check there is the balance
        require(
            _baseBalances[baseToken] >= selectedStrat.amount,
            "Base Balance too low"
        );

        if (feeAmount_ > 0) {
            //  Work out the fee amounts
            feeAmount = _calculateFee(
                selectedStrat.baseToken,
                selectedStrat.amount,
                feeAmount_
            );

            // Transfer the fee to the DCAExecutpr
            _transferFee(feeAmount, baseToken);
        }

        tradeAmount = selectedStrat.amount - feeAmount;

        _approveSwapSpend(baseToken, tradeAmount);

        //  Make the swap on uniswap
        amountIn = _swap(baseToken, targetToken, tradeAmount);

        //  Check if there is a reinvest
        //  Execute the reinvest
        if (selectedStrat.reinvest) {
            _executeReinvest(selectedStrat.reinvestCallData, amountIn);
        }

        //  Update some tracking metrics
        //  Update balance & time track
        _targetBalances[targetToken] += amountIn;
        _baseBalances[baseToken] -= selectedStrat.amount;

        _lastExecution[selectedStrat.strategyId] = block.timestamp;
        _totalIntervalsExecuted += 1;

        emit StrategyExecuted(strategyId_, amountIn, selectedStrat.reinvest);
    }

    function _subscribeToExecutor(Strategy memory newStrategy_) private {
        _costPerBlock[
            newStrategy_.baseToken.tokenAddress
        ] += _calculateCostPerBlock(newStrategy_.amount, newStrategy_.interval);

        _executorAddress.Subscribe(newStrategy_);
        _strategies[newStrategy_.strategyId].active = true;
        _totalActiveStrategies += 1;
        emit StrategySubscribed(
            newStrategy_.strategyId,
            address(_executorAddress)
        );
    }

    function _unsubscribeToExecutor(uint256 strategyId_) private {
        Strategy memory oldStrategy = _strategies[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);

        _executorAddress.Unsubscribe(oldStrategy);
        _strategies[oldStrategy.strategyId].active = false;
        _totalActiveStrategies -= 1;
        emit StrategyUnsubscribed(oldStrategy.strategyId);
    }

    function _changeDefaultExecutor(IDCAExecutor newAddress_) internal {
        require(
            _executorAddress != newAddress_,
            "Already using this DCA executor"
        );
        _executorAddress = newAddress_;
        _changeExecutorAddress(address(newAddress_));
        emit DCAExecutorChanged(address(newAddress_));
    }

    function _calculateCostPerBlock(
        uint256 amount_,
        Interval interval_
    ) internal view returns (uint256) {
        return amount_ / IntervalTimings[interval_];
    }

    function _calculateFee(
        TokeData memory strategyBaseToken_,
        uint256 strategyAmount_,
        uint16 feePercent_
    ) internal pure returns (uint256 feeAmount) {
        // Convert the feePercent_ to the correct decimal places
        // Assuming feePercent_ is in terms of 10,000 (where 10000 = 100%, 100 = 1%, etc.)
        uint256 feeDecimal = feePercent_ *
            10 ** (strategyBaseToken_.decimals - 2);

        // Calculate the fee amount
        feeAmount =
            (strategyAmount_ * feeDecimal) /
            10 ** (strategyBaseToken_.decimals);
        return feeAmount;
    }

    function _transferFee(uint256 feeAmount_, address tokenAddress_) internal {
        // Transfer teh fee to the DCAExecutpr
        require(
            IERC20(tokenAddress_).transfer(
                address(_executorAddress),
                feeAmount_
            ),
            "Fee transfer failed"
        );
    }

    function _approveSwapSpend(address baseToken_, uint256 amount_) internal {
        IERC20 token = IERC20(baseToken_);
        uint256 currentAllowance = token.allowance(
            address(this),
            address(SWAP_ROUTER)
        );

        if (currentAllowance < amount_) {
            // Set the new allowance
            require(
                token.approve(address(SWAP_ROUTER), amount_),
                "Approve failed"
            );
        }
    }

    function _checkSendAllowance(
        address baseToken_,
        address spender_,
        uint256 neededAllowance_
    ) internal view returns (bool) {
        uint256 actualAllowance = IERC20(baseToken_).allowance(
            address(this),
            spender_
        );
        return actualAllowance >= neededAllowance_;
    }

    /**
     * @dev swaps from base token for set amount into any amount of target token
     * @param baseToken_ {address}  token address of the token to swap from
     * @param targetToken_ {address} token address of the token to recieve
     * @param amount_ {uint256} amount returned from the swap
     * @return {uint256} amount returned by the swap
     */

    function _swap(
        address baseToken_,
        address targetToken_,
        uint256 amount_
    ) internal returns (uint256) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: baseToken_,
                tokenOut: targetToken_,
                fee: _poolFee,
                recipient: address(this),
                deadline: block.timestamp + 5 minutes,
                amountIn: amount_,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        //  The call to `exactInputSingle` executes the swap.
        return SWAP_ROUTER.exactInputSingle(params);
    }

    function _executeReinvest(
        bytes memory callData_,
        uint256 amount_
    ) internal {
        // Decode and execute the callData
        // Ensure safety checks and validations
    }
}
