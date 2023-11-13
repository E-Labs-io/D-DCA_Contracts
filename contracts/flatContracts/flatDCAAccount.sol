// Sources flattened with hardhat v2.19.0 https://hardhat.org

// SPDX-License-Identifier: GPL-2.0-or-later AND MIT AND UNLICENSED

pragma abicoder v2;

// File @openzeppelin/contracts/utils/Context.sol@v5.0.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File @openzeppelin/contracts/access/Ownable.sol@v5.0.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File @uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol@v1.0.1

// Original license: SPDX_License_Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

/// @title Callback for IUniswapV3PoolActions#swap
/// @notice Any contract that calls IUniswapV3PoolActions#swap must implement this interface
interface IUniswapV3SwapCallback {
    /// @notice Called to `msg.sender` after executing a swap via IUniswapV3Pool#swap.
    /// @dev In the implementation you must pay the pool tokens owed for the swap.
    /// The caller of this method must be checked to be a UniswapV3Pool deployed by the canonical UniswapV3Factory.
    /// amount0Delta and amount1Delta can both be 0 if no tokens were swapped.
    /// @param amount0Delta The amount of token0 that was sent (negative) or must be received (positive) by the pool by
    /// the end of the swap. If positive, the callback must send that amount of token0 to the pool.
    /// @param amount1Delta The amount of token1 that was sent (negative) or must be received (positive) by the pool by
    /// the end of the swap. If positive, the callback must send that amount of token1 to the pool.
    /// @param data Any data passed through by the caller via the IUniswapV3PoolActions#swap call
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external;
}

// File @uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol@v1.4.4

// Original license: SPDX_License_Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

// Original pragma directive: pragma abicoder v2

/// @title Router token swapping functionality
/// @notice Functions for swapping tokens via Uniswap V3
interface ISwapRouter is IUniswapV3SwapCallback {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another token
    /// @param params The parameters necessary for the swap, encoded as `ExactInputSingleParams` in calldata
    /// @return amountOut The amount of the received token
    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut);

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another along the specified path
    /// @param params The parameters necessary for the multi-hop swap, encoded as `ExactInputParams` in calldata
    /// @return amountOut The amount of the received token
    function exactInput(
        ExactInputParams calldata params
    ) external payable returns (uint256 amountOut);

    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    /// @notice Swaps as little as possible of one token for `amountOut` of another token
    /// @param params The parameters necessary for the swap, encoded as `ExactOutputSingleParams` in calldata
    /// @return amountIn The amount of the input token
    function exactOutputSingle(
        ExactOutputSingleParams calldata params
    ) external payable returns (uint256 amountIn);

    struct ExactOutputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
    }

    /// @notice Swaps as little as possible of one token for `amountOut` of another along the specified path (reversed)
    /// @param params The parameters necessary for the multi-hop swap, encoded as `ExactOutputParams` in calldata
    /// @return amountIn The amount of the input token
    function exactOutput(
        ExactOutputParams calldata params
    ) external payable returns (uint256 amountIn);
}

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

// File @uniswap/v3-periphery/contracts/libraries/TransferHelper.sol@v1.4.4

// Original license: SPDX_License_Identifier: GPL-2.0-or-later
pragma solidity >=0.6.0;

library TransferHelper {
    /// @notice Transfers tokens from the targeted address to the given destination
    /// @notice Errors with 'STF' if transfer fails
    /// @param token The contract address of the token to be transferred
    /// @param from The originating address from which the tokens will be transferred
    /// @param to The destination address of the transfer
    /// @param value The amount to be transferred
    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(
                IERC20.transferFrom.selector,
                from,
                to,
                value
            )
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "STF"
        );
    }

    /// @notice Transfers tokens from msg.sender to a recipient
    /// @dev Errors with ST if transfer fails
    /// @param token The contract address of the token which will be transferred
    /// @param to The recipient of the transfer
    /// @param value The value of the transfer
    function safeTransfer(address token, address to, uint256 value) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "ST"
        );
    }

    /// @notice Approves the stipulated contract to spend the given allowance in the given token
    /// @dev Errors with 'SA' if transfer fails
    /// @param token The contract address of the token to be approved
    /// @param to The target of the approval
    /// @param value The amount of the given token the target will be allowed to spend
    function safeApprove(address token, address to, uint256 value) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.approve.selector, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "SA"
        );
    }

    /// @notice Transfers ETH to the recipient address
    /// @dev Fails with `STE`
    /// @param to The destination of the transfer
    /// @param value The value to be transferred
    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "STE");
    }
}

// File contracts/interfaces/IDCADataStructures.sol

// Original license: SPDX_License_Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IDCADataStructures {
    // Define an enum to represent the interval type
    enum Interval {
        TestInterval, //Only for development
        OneDay, // 1 day = 5760 blocks
        TwoDays, // 2 days = 11520 blocks
        OneWeek, // 1 week = 40320 blocks
        OneMonth // 1 month = 172800 blocks
    }

    struct FeeDistribution {
        //These may move to s struct or set of if more call data is needed
        uint16 amountToExecutor; //In percent
        uint16 amountToComputing; //In percent
        uint16 amountToAdmin;
        uint16 feeAmount; //In percent
        address executionAddress;
        address computingAddress; //need to look into how distributed computing payments work
        address adminAddress;
    }

    // Define the Strategy struct
    struct Strategy {
        address accountAddress;
        TokeData baseToken;
        TokeData targetToken;
        Interval interval;
        uint256 amount;
        uint256 strategyId;
        bool reinvest;
        bool active;
        address revestContract; // should this be call data to execute?
    }

    struct TokeData {
        address tokenAddress;
        uint8 decimals;
        string ticker;
    }
}

// File contracts/interfaces/IDCAExecutor.sol

// Original license: SPDX_License_Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IDCAExecutor is IDCADataStructures {
    event ExecutionEOAAddressChange(address newExecutionEOA_, address changer_);
    event ExecutedDCA(Interval indexed interval_);
    event DCAAccontSubscription(Strategy interval_, bool active_);

    function Subscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Unsubscribe(
        Strategy calldata strategy_
    ) external returns (bool sucsess);

    function Execute(Interval interval_) external;

    function ForceFeeFund() external;
}

// File contracts/interfaces/IDCAAccount.sol

// Original license: SPDX_License_Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IDCAAccount is IDCADataStructures {
    /**
     *
     * @param strategyId_ the id fo the executed strategy
     * @param amountIn_ amount received from the swap
     */
    event StrategyExecuted(
        uint256 indexed strategyId_,
        uint256 indexed amountIn_
    );
    event DCAExecutorChanged(address newAddress_);
    event StrategySubscribed(uint256 strategyId_, address executor_);
    event StrategyUnsubscribed(uint256 strategyId_);

    function Execute(uint256 strategyId_, uint16 feeAmount_) external;

    function SetupStrategy(
        Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToEcecutor_
    ) external;

    function SubscribeStrategy(uint256 strategyId_) external;

    function UnsubscribeStrategy(uint256 stratogyId) external;

    function FundAccount(address token_, uint256 amount_) external;

    function GetBaseBalance(address token_) external returns (uint256);

    function GetTargetBalance(address token_) external returns (uint256);

    function UnFundAccount(address token_, uint256 amount_) external;

    function WithdrawSavings(address token_, uint256 amount_) external;
}

// File contracts/security/onlyExecutor.sol

pragma solidity ^0.8.20;

abstract contract OnlyExecutor is Ownable {
    address private _executor;

    constructor(address executorAddress_) {
        _executor = executorAddress_;
    }

    modifier onlyExecutor() {
        require(_executor == msg.sender, "Address is not the executor");
        _;
    }

    function _changeExecutorAddress(address newAddress_) internal {
        _executor = newAddress_;
    }

    function removeExecutor() public onlyOwner {
        _executor = address(0x0);
    }

    function changeExecutor(address newExecutorAddress_) public onlyOwner {
        _executor = address(newExecutorAddress_);
    }
}

// File contracts/DCAAccount.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

// Original pragma directive: pragma experimental ABIEncoderV2

contract DCAAccount is OnlyExecutor, IDCAAccount {
    Strategy[] private strategies_;
    // Thought on tracking balances, do we
    // a) base & target are mixed according to the token
    // b) separate accounting for base & target funds
    //   Option B
    mapping(address => uint256) private _baseBalances;
    mapping(address => uint256) private _targetBalances;

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(address => uint256) internal _costPerBlock;
    // Mapping of Interval enum to block amounts
    mapping(Interval => uint256) public IntervalTimings;

    IDCAExecutor internal _executorAddress;

    uint24 private _poolFee = 10000;
    uint256 private _totalIntervalsExecuted;
    uint256 private _totalActiveStrategies;

    ISwapRouter immutable SWAP_ROUTER;

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
                IntervalTimings[strategies_[strategyId_].interval] <
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
        require(strategies_[strategyId_].active, "Strategy is not active");
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

    function SubscribeStrategy(
        uint256 strategyId_
    ) external override onlyOwner {
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
    ) external override onlyOwner {
        //remove the given strategy from its active executor
        require(
            strategies_[strategyId_].active,
            "Strategy is already Unsubscribed"
        );
        _unsubscribeToExecutor(strategyId_);
    }

    function ExecutorDeactivateStrategy(
        uint256 strategyId_
    ) external onlyExecutor {
        Strategy memory oldStrategy = strategies_[strategyId_];
        _costPerBlock[
            oldStrategy.baseToken.tokenAddress
        ] -= _calculateCostPerBlock(oldStrategy.amount, oldStrategy.interval);
        strategies_[oldStrategy.strategyId].active = false;
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
        return strategies_[strategyId_];
    }

    // Internal & Private functions
    function _executeDCATrade(uint256 strategyId_, uint16 feeAmount_) internal {
        //Example of how this might work using Uniswap
        //Get the stragegy
        Strategy memory selectedStrat = strategies_[strategyId_];
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

        //  Update some tracking metrics
        //  Update balance & time track
        _targetBalances[targetToken] += amountIn;
        _baseBalances[baseToken] -= selectedStrat.amount;

        _lastExecution[selectedStrat.strategyId] = block.timestamp;
        _totalIntervalsExecuted += 1;

        emit StrategyExecuted(strategyId_, amountIn);
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
}
