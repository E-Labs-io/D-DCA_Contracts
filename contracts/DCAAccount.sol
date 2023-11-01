// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./interfaces/IDCADataStructures.sol";
import "./interfaces/IDCAAccount.sol";
import "./interfaces/IDCAExecutor.sol";
import "./security/onlyExecutor.sol";

contract DCAAccount is OnlyExecutor, IDCAAccount {
    Strategy[] private strategies_;
    // Thought on tracking balances, do we
    // a) base & target are mixed according to the token
    // b) separate accounting for base & target funds
    //   Option A
    mapping(IERC20 => uint256) private _balances;
    //   Option B
    mapping(IERC20 => uint256) private _baseBalances;
    mapping(IERC20 => uint256) private _targetBalances;

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(IERC20 => uint256) internal _costPerBlock;
    // Mapping of Interval enum to block amounts
    mapping(Interval => uint256) public IntervalTimings;

    IDCAExecutor internal _executorAddress;

    uint24 private _poolFee = 3000;
    uint256 private _totalIntervalsExecuted;
    uint256 private _totalActiveStrategies;

    address constant WETH = 0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3;
    address constant USDC = 0xd513E4537510C75E24f941f159B7CAFA74E7B3B9;
    address constant DAI = 0xe73C6dA65337ef99dBBc014C7858973Eba40a10b;
    address constant USDT = 0x8dA9412AbB78db20d0B496573D9066C474eA21B8;

    ISwapRouter immutable SWAP_ROUTER;

    constructor(
        address executorAddress_,
        address swapRouter_
    ) OnlyExecutor(address(executorAddress_)) Ownable(address(msg.sender)) {
        _changeDefaultExecutor(IDCAExecutor(executorAddress_));
        SWAP_ROUTER = ISwapRouter(swapRouter_);

        IntervalTimings[Interval.TestInterval] = 20;
        IntervalTimings[Interval.OneDay] = 5760;
        IntervalTimings[Interval.TwoDays] = 11520;
        IntervalTimings[Interval.OneWeek] = 40320;
        IntervalTimings[Interval.OneMonth] = 172800;
    }

    // Public Functions
    function Execute(
        uint256 strategyId_,
        uint256 feeAmount_
    ) public override onlyExecutor {
        require(strategies_[strategyId_].active, "Strategy is not active");
        _executeDCATrade(strategyId_, feeAmount_);
    }

    function SetupStrategy(
        Strategy memory newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) public override onlyOwner {
        //Adds a new strategy to the system
        //Transfers the given amount of the base token to the account
        //If true subscribes the strategy to the default executor
        newStrategy_.strategyId = strategies_.length;
        newStrategy_.accountAddress = address(this);
        newStrategy_.active = false;
        strategies_.push(newStrategy_);

        if (seedFunds_ > 0)
            FundAccount(newStrategy_.baseToken.tokenAddress, seedFunds_);
        if (subscribeToExecutor_) _subscribeToExecutor(newStrategy_);
    }

    function SubscribeStrategy(uint256 strategyId_) public override onlyOwner {
        //Add the given strategy, once checking there are funds
        //to the default DCAExecutor
        require(
            !strategies_[strategyId_].active,
            "Strategy is already Subscribed"
        );
        _subscribeToExecutor(strategies_[strategyId_]);
    }

    function UnsubscribeStrategy(
        uint256 strategyId_
    ) public override onlyOwner {
        //remove the given strategy from its active executor
        require(
            strategies_[strategyId_].active,
            "Strategy is already Unsubscribed"
        );
        _unsubscribeToExecutor(strategyId_);
    }

    function ExecutorDeactivateStrategy(
        uint256 strategyId_
    ) public onlyExecutor {
        Strategy memory oldStrategy = strategies_[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);
        strategies_[oldStrategy.strategyId].active = false;
        _totalActiveStrategies -= 1;

        emit StrategyUnsubscribed(oldStrategy.strategyId);
    }

    function FundAccount(
        IERC20 token_,
        uint256 amount_
    ) public override onlyOwner {
        //Transfer the given amount of the given ERC20 token to the DCAAccount
        IERC20(token_).transferFrom(msg.sender, address(this), amount_);
        _baseBalances[token_] += amount_;
    }

    function UnFundAccount(IERC20 token_, uint256 amount_) public onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(_baseBalances[token_] <= amount_, "Balance of token to low");
        IERC20(token_).transfer(msg.sender, amount_);
        _baseBalances[token_] -= amount_;
    }

    function WithdrawSavings(IERC20 token_, uint256 amount_) public onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(_targetBalances[token_] <= amount_, "Balance of token to low");
        IERC20(token_).transfer(msg.sender, amount_);
        _targetBalances[token_] -= amount_;
    }

    function GetBaseTokenCostPerBlock(
        IERC20 baseToken_
    ) public view returns (uint256) {
        return _costPerBlock[baseToken_];
    }

    function GetBaseTokenRemainingBlocks(
        IERC20 baseToken_
    ) public view returns (uint256) {
        return _baseBalances[baseToken_] / _costPerBlock[baseToken_];
    }

    function GetBaseBalance(
        IERC20 token_
    ) public view override returns (uint256) {
        return _baseBalances[token_];
    }

    function GetTargetBalance(
        IERC20 token_
    ) public view override returns (uint256) {
        return _targetBalances[token_];
    }

    function GetStrategyData(
        uint256 strategyId_
    ) public view returns (Strategy memory) {
        return strategies_[strategyId_];
    }

    // Internal & Private functions
    function _executeDCATrade(
        uint256 strategyId_,
        uint256 feeAmount_
    ) internal {
        //Example of how this might work using Uniswap
        //Get the stragegy
        Strategy memory selectedStrat = strategies_[strategyId_];

        //Check there is the balance
        if (
            _baseBalances[selectedStrat.baseToken.tokenAddress] <
            selectedStrat.amount
        ) return;
        //  Work out the fee amounts
        uint256 feeAmount = _calculateFee(
            selectedStrat.baseToken,
            selectedStrat.amount,
            feeAmount_
        );
        uint256 tradeAmount = selectedStrat.amount - feeAmount;

        // Approve the router to spend the token in Uniswap.
        _approveSwapSpend(selectedStrat.baseToken.tokenAddress, tradeAmount);
        // Transfer teh fee to the DCAExecutpr
        _transferFee(feeAmount, selectedStrat.baseToken.tokenAddress);

        ISwapRouter.ExactInputSingleParams memory params = _buildSwapParams(
            selectedStrat.baseToken.tokenAddress,
            selectedStrat.targetToken.tokenAddress,
            tradeAmount
        );

        // The call to `exactInputSingle` executes the swap.
        // Update balance & timetrack
        uint256 amountOut = SWAP_ROUTER.exactInputSingle(params);
        //  Update some tracking metrics
        _targetBalances[selectedStrat.baseToken.tokenAddress] += amountOut;
        _baseBalances[selectedStrat.targetToken.tokenAddress] -= selectedStrat
            .amount;
        _lastExecution[selectedStrat.strategyId] = block.timestamp;
        _totalIntervalsExecuted += 1;
        emit StratogyExecuted(selectedStrat.strategyId);
    }

    function _subscribeToExecutor(Strategy memory newStrategy_) private {
        _costPerBlock[
            newStrategy_.baseToken.tokenAddress
        ] += _calculateCostPerBlock(newStrategy_.amount, newStrategy_.interval);

        _executorAddress.Subscribe(newStrategy_);
        strategies_[newStrategy_.strategyId].active = true;
        _totalActiveStrategies += 1;
        emit StrategySubscribed(
            newStrategy_.strategyId,
            address(_executorAddress)
        );
    }

    function _unsubscribeToExecutor(uint256 strategyId_) private {
        Strategy memory oldStrategy = strategies_[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);

        _executorAddress.Unsubscribe(oldStrategy);
        strategies_[oldStrategy.strategyId].active = false;
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
        uint256 feeAmount_
    ) internal returns (uint256 feeAmount) {
        // Need some logic to handel conversion of percent to the baseToken decimal places
        feeAmount = strategyAmount_ / feeAmount_;
        return feeAmount;
    }

    function _transferFee(uint256 feeAmount_, IERC20 tokenAddress_) internal {
        // Transfer teh fee to the DCAExecutpr
        tokenAddress_.transfer(address(_executorAddress), feeAmount_);
    }

    function _approveSwapSpend(IERC20 tokenAddress_, uint256 amount_) private {
        tokenAddress_.approve(address(SWAP_ROUTER), amount_);
    }

    function _buildSwapParams(
        IERC20 baseToken_,
        IERC20 targetToken_,
        uint256 amount_
    ) internal returns (ISwapRouter.ExactInputSingleParams memory) {
        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        return
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(baseToken_),
                tokenOut: address(targetToken_),
                fee: _poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount_,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
    }
}
