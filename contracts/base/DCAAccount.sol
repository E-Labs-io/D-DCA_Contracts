// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//DEV
import "hardhat/console.sol";

// PRODUCTION
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IUniversalRouter} from "../protocols/uniswap/IUniversalRouter.sol";
import {IDCADataStructures} from "../interfaces/IDCADataStructures.sol";
import {IDCAAccount} from "../interfaces/IDCAAccount.sol";
import {IDCAExecutor} from "../interfaces/IDCAExecutor.sol";
import {OnlyExecutor} from "../security/onlyExecutor.sol";
import {Strategies} from "../library/Strategys.sol";
import {DCAReinvestLogic, DCAReinvest} from "../base/DCAReinvest.sol";

contract DCAAccount is OnlyExecutor, IDCAAccount {
    using Strategies for uint256;
    using Strategies for Strategy;

    mapping(uint256 => Strategy) private _strategies;

    mapping(address => uint256) private _baseBalances;
    mapping(address => uint256) private _targetBalances;
    mapping(uint256 => uint256) private _reinvestLiquidityTokenBalance; // strat Id to balance of liquidity token

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(address => uint256) internal _costPerBlock; //  Base currency

    // Mapping of Interval enum to block amounts
    // Should move to a library using constants

    //IDCAExecutor internal _executorAddress;
    IUniversalRouter public SWAP_ROUTER;
    DCAReinvest private DCAREINVEST_LIBRARY;
    address private PERMIT2_ADDRESS;

    uint24 private _poolFee = 5000;

    uint256 private _totalIntervalsExecuted;
    uint256 private _totalActiveStrategies;
    uint256 private _strategyCount;

    constructor(
        address executorAddress_,
        address swapRouter_,
        address owner_,
        address reinvestLibraryContract_,
        address permit2Contract_
    ) OnlyExecutor(owner_, executorAddress_) {
        //  _executorAddress = IDCAExecutor(executorAddress_);
        DCAREINVEST_LIBRARY = DCAReinvest((reinvestLibraryContract_));
        SWAP_ROUTER = IUniversalRouter(swapRouter_);
        PERMIT2_ADDRESS = permit2Contract_;
    }

    fallback() external payable {}

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {}

    /**
     * @dev Modifier to check if a strategy is within the allowed execution window
     * @param strategyId_ {uint256} Id of the strategy to check if is in window
     */

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

    /**
     * @dev Updates the Uniswap SwapRouter Address
     * @param swapRouter_ {address} New address for the Uniswap router
     */
    function updateSwapAddress(address swapRouter_) public onlyOwner {
        SWAP_ROUTER = IUniversalRouter(swapRouter_);
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
        require(
            _baseBalances[_strategies[strategyId_].baseToken.tokenAddress] >=
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
            _strategies[strategyId_].active,
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
        DCAReinvest.Reinvest memory reinvest_ //bool migrateOrWithdrawCurrentReinvest_
    ) external override {
        if (reinvest_.active) {
            _strategies[strategyId_].reinvest = reinvest_;
        } else
            _strategies[strategyId_].reinvest = DCAReinvestLogic.Reinvest(
                new bytes(0),
                false,
                0x00,
                address(this)
            );
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
     * @dev get amount of blocks remaining for given base token
     * @param token_ {address} Base token address
     * @return {uint256} amount of blocks left for given base token balance
     */
    function getBaseTokenRemainingBlocks(
        address token_
    ) external view returns (uint256) {
        return _baseBalances[token_] / _costPerBlock[token_];
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
     * @dev returns UI data for strategy interval timing
     * @param strategyId_ Strategy Id of the strategy data to get
     * @return lastEx {uint256} time of last execution (seconds)
     * @return secondsLeft {uint256} seconds left timm strategy is in window
     * @return checkReturn {bool} if the strategy is in the window
     */
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

    /**
     * @dev Internal & Private functions
     */

    /**
     * @dev logic for executing a strategy
     * @param strategyId_ Strategy Id of the strategy data to execute
     * @param feeAmount_ Amount to charge as fee in percent
     * @notice percent breakdown where 10000 = 100%, 100 = 1%, etc.
     * @return {bool} if the execution was sucsessful
     */
    function _executeDCATrade(
        uint256 strategyId_,
        uint16 feeAmount_
    ) internal returns (bool) {
        Strategy memory strategy = _strategies[strategyId_];
        uint256 fee = Strategies._calculateFee(
            strategy.amount,
            feeAmount_,
            strategy.baseToken.decimals
        );

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
        uint256 reinvestAmount;
        bool success;

        if (amountIn > 0) {
            if (strategy.reinvest.active) {
                (reinvestAmount, success) = _executeReinvest(
                    strategyId_,
                    strategy.reinvest,
                    amountIn
                );
            }

            if (success) {
                _reinvestLiquidityTokenBalance[strategyId_] += reinvestAmount;
            } else
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

    /**
     * @dev logic to subscribe strategy to an executor
     * @param strategyData_ data struct of the strategy to subscribe
     */
    function _subscribeToExecutor(Strategy memory strategyData_) private {
        _costPerBlock[
            strategyData_.baseToken.tokenAddress
        ] += _calculateCostPerBlock(
            strategyData_.amount,
            strategyData_.interval
        );

        IDCAExecutor(_executor()).Subscribe(strategyData_);
        _strategies[strategyData_.strategyId].active = true;
        _totalActiveStrategies += 1;
        emit StrategySubscribed(strategyData_.strategyId, _executor());
    }

    /**
     * @dev logic to unsubscribe strategy to an executor
     * @param strategyId_ Id of the strategy to unsubscribe
     */
    function _unsubscribeToExecutor(uint256 strategyId_) private {
        Strategy memory oldStrategy = _strategies[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);

        IDCAExecutor(_executor()).Unsubscribe(address(this), strategyId_);
        _strategies[oldStrategy.strategyId].active = false;
        _totalActiveStrategies--;
        emit StrategyUnsubscribed(oldStrategy.strategyId);
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
     * @dev calculate cost per block for the given interval & amount of spot sell
     * @param amount_ amount of the token
     * @param interval_ execution interval
     */
    function _calculateCostPerBlock(
        uint256 amount_,
        Interval interval_
    ) internal pure returns (uint256) {
        return amount_ / Strategies._getIntervalBlockAmount(interval_);
    }

    /**
     * @dev logic to transfer the fee to the executor contract
     * @param feeAmount_ amount of the token to transfer as fee
     * @param tokenAddress_ token address of the payable fee token
     */
    function _transferFee(uint256 feeAmount_, address tokenAddress_) internal {
        // Transfer teh fee to the DCAExecutpr
        require(
            IERC20(tokenAddress_).transfer(_executor(), feeAmount_),
            "Fee transfer failed"
        );
    }

    /**
     * @dev logic to approve external address to spend given token
     * @param baseToken_ address of the base token to allow contract to spend
     * @param amount_ amount to limit the spend
     */
    function _approveSwapSpend(address baseToken_, uint256 amount_) internal {
        IERC20 token = IERC20(baseToken_);
        uint256 currentAllowance = token.allowance(
            address(this),
            PERMIT2_ADDRESS
        );

        if (currentAllowance < amount_) {
            // Set the new allowance
            require(
                token.approve(address(SWAP_ROUTER), amount_),
                "Approve failed"
            );
        }
    }

    /**
     * @dev Check if the spender has enough spend to execute
     * @param baseToken_ Address of the base token to check allowance of
     * @param spender_ address of the spending contract
     * @param neededAllowance_ amount of the base token the allowance
     */
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
        bytes memory path = abi.encodePacked(
            baseToken_,
            _poolFee,
            targetToken_
        );

        bytes memory command = abi.encodePacked(bytes1(0x00));

        uint256 oldBal = IERC20(targetToken_).balanceOf(address(this));

        console.log("Pre Swap Bal", oldBal);
        console.log("Commands Length", command.length);

        bytes[] memory inputs = new bytes[](1);
        inputs[0] = abi.encode(address(this), amount_, 0, path, false);
        console.log("inputs Length", inputs.length);

        SWAP_ROUTER.execute(command, inputs);
        uint256 newBal = IERC20(targetToken_).balanceOf(address(this));

        console.log("Post Swap Bal", newBal);
        console.log("Swap Amount", newBal - oldBal);
        return newBal - oldBal;
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
        DCAREINVEST_LIBRARY = DCAReinvest((newLibraryAddress_));
        emit DCAReinvestLibraryChanged(newLibraryAddress_);
    }

    /**
     * @dev logic to execute a reinvest portion of the strategy
     * @notice Only working on call, not delegatecall
     * @param strategyId_ id of the strategy being executed
     * @param reinvest_ reinvest data struct of the strategy being executed
     * @param amount_ amount of the target   token to reinvest
     */
    function _executeReinvest(
        uint256 strategyId_,
        DCAReinvest.Reinvest memory reinvest_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (DCAREINVEST_LIBRARY.REINVEST_ACTIVE()) {
            (bool txSuccess, bytes memory returnData) = address(
                DCAREINVEST_LIBRARY
            ).delegatecall(
                    abi.encodeWithSelector(
                        DCAREINVEST_LIBRARY.executeReinvest.selector,
                        reinvest_,
                        amount_
                    )
                );
            if (txSuccess) {
                (amount, success) = abi.decode(returnData, (uint256, bool));
                emit StrategyReinvestExecuted(strategyId_, success);
                return (amount, success);
            }
        }
        emit StrategyReinvestExecuted(strategyId_, false);
        return (0, false);
    }

    /**
     * @dev withdraws and unwinds a given amount of the reinvest amount
     * @notice NOT WORKING YET
     * @param strategyId_ id of the strategy to be withdrawn
     * @param reinvest_ reinvest data struct of the strategy being withdrawn
     * @param amount_ amount of the target token to withdraw
     */
    function _withdrawReinvest(
        uint256 strategyId_,
        DCAReinvest.Reinvest memory reinvest_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        (bool txSuccess, bytes memory returnData) = address(DCAREINVEST_LIBRARY)
            .delegatecall(
                abi.encodeWithSelector(
                    DCAREINVEST_LIBRARY.unwindReinvest.selector,
                    reinvest_,
                    amount_
                )
            );
        if (txSuccess) {
            (amount, success) = abi.decode(returnData, (uint256, bool));
            _reinvestLiquidityTokenBalance[strategyId_] -= amount_;
            _targetBalances[
                _strategies[strategyId_].targetToken.tokenAddress
            ] += amount;

            return (amount, success);
        }

        return (amount, success);
    }

    function getAttachedReinvestLibraryVersion()
        public
        view
        returns (string memory)
    {
        return DCAREINVEST_LIBRARY.getLibraryVersion();
    }

    function getAttachedReinvestLibraryAddress() public view returns (address) {
        return address(DCAREINVEST_LIBRARY);
    }
}
