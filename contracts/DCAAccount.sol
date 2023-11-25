// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import "./interfaces/IDCADataStructures.sol";
import "./interfaces/IDCAAccount.sol";
import "./interfaces/IDCAExecutor.sol";
import "./security/onlyExecutor.sol";
import "./library/Strategys.sol";

contract DCAAccount is OnlyExecutor, IDCAAccount {
    using Strategies for uint256;
    using Strategies for Strategy;

    mapping(uint256 => Strategy) private _strategies;

    mapping(address => uint256) private _baseBalances;
    mapping(address => uint256) private _targetBalances;

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(address => uint256) internal _costPerBlock; //  Base currency

    // Mapping of Interval enum to block amounts
    // Should move to a library using constants

    IDCAExecutor internal _executorAddress;
    ISwapRouter private SWAP_ROUTER;

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
    }

    modifier inWindow(uint256 strategyId_) {
        require(
            Strategies._isStrategyInWindow(
                _lastExecution[strategyId_],
                _strategies[strategyId_].interval
            ),
            "DCAAccount : [inWindow] Strategy Interval not met"
        );
        _;
    }

    function updateSwapAddress(address swapRouter_) public onlyOwner {
        SWAP_ROUTER = ISwapRouter(swapRouter_);
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
    ) external override onlyExecutor inWindow(strategyId_) returns (bool) {
        require(
            _strategies[strategyId_].active,
            "DCAAccount : [Execute] Strategy is not active"
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
        IDCADataStructures.Strategy memory newStrategy_,
        uint256 seedFunds_,
        bool subscribeToExecutor_
    ) external override onlyOwner {
        require(
            newStrategy_._isValidStrategy(),
            "DCAAccount : [SetupStrategy] Invalid strategy data"
        );

        _strategyCount++;
        newStrategy_.strategyId = _strategyCount;
        newStrategy_.accountAddress = address(this);
        newStrategy_.active = false;
        _strategies[_strategyCount] = newStrategy_;

        if (seedFunds_ > 0) {
            FundAccount(newStrategy_.baseToken.tokenAddress, seedFunds_);
        }
        if (subscribeToExecutor_) {
            _subscribeToExecutor(newStrategy_);
        }

        emit NewStrategyCreated(_strategyCount);
    }

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

    function UnsubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
        //remove the given strategy from its active executor
        require(
            _strategies[strategyId_].active,
            "DCAAccount : [UnsubscribeStrategy] Strategy is already Unsubscribed"
        );
        _unsubscribeToExecutor(strategyId_);
    }

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
        require(
            _baseBalances[token_] >= amount_,
            "DCAAccount : [UnFundAccount] Balance of token to low"
        );
        _baseBalances[token_] -= amount_;
        IERC20(token_).transfer(msg.sender, amount_);
    }

    function WithdrawSavings(
        address token_,
        uint256 amount_
    ) external onlyOwner {
        //Transfer the given amount of the given ERC20 token out of the DCAAccount
        require(
            _targetBalances[token_] >= amount_,
            "DCAAccount : [WithdrawSavings] Balance of token to low"
        );
        _targetBalances[token_] -= amount_;
        IERC20(token_).transfer(msg.sender, amount_);
    }

    function SetStrategyReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_
    ) external override {
        _strategies[strategyId_].reinvest = reinvest_;
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

    function getTimeTillWindow(
        uint256 strategyId_
    )
        public
        view
        returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
    {
        lastEx = _lastExecution[strategyId_];
        IDCADataStructures.Interval inter = _strategies[strategyId_].interval;

        secondsLeft = Strategies._secondsLeftTilLWindow(lastEx, inter);

        checkReturn = Strategies._isStrategyInWindow(lastEx, inter);

        return (lastEx, secondsLeft, checkReturn);
    }

    // Internal & Private functions
    function _executeDCATrade(
        uint256 strategyId_,
        uint16 feeAmount_
    ) internal returns (bool) {
        Strategy memory strategy = _strategies[strategyId_];
        uint256 fee = Strategies._calculateFee(strategy.amount, feeAmount_, 18); // Assuming token has 18 decimals
        uint256 tradeAmount = strategy.amount - fee;

        if (feeAmount_ > 0) {
            _transferFee(fee, strategy.baseToken.tokenAddress);
        }

        _approveSwapSpend(strategy.baseToken.tokenAddress, tradeAmount);
        uint256 amountIn = _swap(
            strategy.baseToken.tokenAddress,
            strategy.targetToken.tokenAddress,
            tradeAmount
        );

        if (amountIn > 0) {
            if (strategy.reinvest.active) {
                _executeReinvest(
                    strategy.reinvest,
                    strategy.targetToken.tokenAddress,
                    amountIn
                );
            }

            _targetBalances[strategy.targetToken.tokenAddress] += amountIn;
            _baseBalances[strategy.baseToken.tokenAddress] -= strategy.amount;
            _lastExecution[strategyId_] = block.timestamp;
            _totalIntervalsExecuted++;

            emit StrategyExecuted(
                strategyId_,
                amountIn,
                strategy.reinvest.active
            );
            return true;
        } else {
            return false;
        }
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

        _executorAddress.Unsubscribe(address(this), strategyId_);
        _strategies[oldStrategy.strategyId].active = false;
        _totalActiveStrategies--;
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
    ) internal pure returns (uint256) {
        return amount_ / Strategies._getIntervalBlockAmount(interval_);
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

    function SWAP(
        address baseToken_,
        address targetToken_,
        uint256 amount_
    ) public {
        bool sucsess = IERC20(baseToken_).approve(
            address(SWAP_ROUTER),
            amount_
        );
        if (sucsess) _swap(baseToken_, targetToken_, amount_);
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
        Reinvest memory reinvest_,
        address targetTokenAddress_,
        uint256 amount_
    ) internal {
        // Decode and execute the reinvest deposit function
        // Ensure safety checks and validations
        // Approve reinvester contract to spend
    }

    function _withdrawReinvest(
        Reinvest memory reinvestm,
        address targetTokenAddress_,
        uint256 amount_
    ) internal {
        // Decode and execute the reinvest withdraw function
    }
}
