// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/swap.sol";
import {Strategies, Intervals} from "../library/Strategys.sol";
import {Fee} from "../library/Fees.sol";
import {OnlyExecutor} from "../security/onlyExecutor.sol";
import {IDCAAccount} from "../interfaces/IDCAAccount.sol";
import {IDCAReinvest} from "../interfaces/IDCAReinvest.sol";
import {IDCAExecutor} from "../interfaces/IDCAExecutor.sol";

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

abstract contract DCAAccountLogic is Swap, OnlyExecutor, IDCAAccount {
    using Fee for uint16;
    using Strategies for Strategy;
    using Intervals for Interval;
    using SafeERC20 for IERC20; // Added using statement for SafeERC20

    // V0.9 require(string) → custom errors
    error IntervalWindowNotMet();
    error InvalidStrategyData();
    /// @notice The swap executed but returned zero output tokens.
    error SwapReturnedNothing();

    mapping(uint256 => Strategy) internal _strategies;

    mapping(address => uint256) internal _baseBalances;
    mapping(address => uint256) internal _targetBalances;
    mapping(uint256 => uint256) internal _reinvestLiquidityTokenBalance; // strat Id to balance of liquidity token

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number

    uint256 internal _totalActiveStrategies;
    uint256 internal _strategyCount;

    IDCAReinvest private DCAREINVEST_LIBRARY;

    /**
     * @dev Modifier to check if a strategy is within the allowed execution window
     * @param strategyId_ {uint256} Id of the strategy to check if is in window
     */
    modifier inWindow(uint256 strategyId_) {
        if (
            !_strategies[strategyId_].interval.isInWindow(
                _lastExecution[strategyId_]
            )
        ) revert IntervalWindowNotMet();
        _;
    }

    /**
     * @notice EXECUTE Logic
     */

    /**
     * @dev logic to create a new strategy
     * @param newStrategy_ the strategy data to create
     * @notice Emits a StrategyCreated event on completion
     */
    function _newStrategy(Strategy memory newStrategy_) internal {
        if (!newStrategy_.isValid()) revert InvalidStrategyData();

        _strategyCount++;
        newStrategy_.strategyId = _strategyCount;
        newStrategy_.accountAddress = address(this);
        newStrategy_.active = false;

        _strategies[_strategyCount] = newStrategy_;
        emit StrategyCreated(_strategyCount);
    }

    /**
     * @dev logic for executing a strategy
     * @param strategyId_ Strategy Id of the strategy data to execute
     * @param feePercent_ Amount to charge as fee in percent
     * @param minAmountOut_ absolute minimum acceptable swap output,
     *        supplied by the executor from an off-chain market quote
     * @notice percent breakdown where 10000 = 100%, 100 = 1%, etc.
     * @notice V0.9 failure semantics: any failure REVERTS the whole
     *  transaction rather than returning false. This keeps three
     *  invariants the old return-false path broke:
     *    1. the fee can never leave while the ledger still counts it
     *       (insolvency drift),
     *    2. the execution window is only consumed by a successful
     *       execution (_lastExecution set after the swap),
     *    3. account-side and executor-side window state cannot diverge.
     * @return  if the execution was successful
     */
    function _executeDCATrade(
        uint256 strategyId_,
        uint16 feePercent_,
        uint256 minAmountOut_
    ) internal returns (bool) {
        Strategy memory strategy = _strategies[strategyId_];
        uint256 fee = feePercent_.getFee(strategy.amount);
        uint256 tradeAmount = strategy.amount - fee;
        (address baseAddress, address targetAddress) = strategy
            .getTokenAddresses();

        // Commit the full strategy amount up-front (checks-effects-
        // interactions): caller has already verified the balance covers
        // strategy.amount. If anything below reverts, this decrement
        // reverts with it — there is no partial state where the fee has
        // left the contract but the ledger still counts it.
        _baseBalances[baseAddress] -= strategy.amount;

        if (fee > 0) {
            _transferFee(fee, baseAddress);
        }

        _approveSwapSpend(baseAddress, tradeAmount);
        uint256 amountIn = _swap(
            baseAddress,
            targetAddress,
            tradeAmount,
            minAmountOut_
        );
        if (amountIn == 0) revert SwapReturnedNothing();

        // Window is only consumed by a successful execution — a revert
        // above leaves _lastExecution untouched so the executor can
        // retry within the same window.
        _lastExecution[strategyId_] = block.timestamp;

        uint256 reinvestAmount;
        bool success;

        if (strategy.reinvest.active) {
            (reinvestAmount, success) = _executeReinvest(
                strategy.reinvest,
                amountIn
            );

            emit ReinvestExecuted(strategyId_, success, reinvestAmount);
        }

        if (success) {
            _reinvestLiquidityTokenBalance[strategyId_] += reinvestAmount;
        } else {
            // No reinvest configured, or the reinvest module declined:
            // the swapped tokens stay in the account as target savings.
            _targetBalances[targetAddress] += amountIn;
        }

        emit StrategyExecuted(strategyId_, amountIn, success);
        return true;
    }

    /**
     * @dev logic to subscribe strategy to an executor
     * @param strategyData_ data struct of the strategy to subscribe
     */
    function _subscribeToExecutor(Strategy memory strategyData_) internal {
        IDCAExecutor(_executor()).Subscribe(strategyData_);
        _strategies[strategyData_.strategyId].active = true;
        _totalActiveStrategies += 1;
        emit StrategySubscription(strategyData_.strategyId, _executor(), true);
    }

    /**
     * @dev logic to unsubscribe strategy to an executor
     * @param strategyId_ Id of the strategy to unsubscribe
     */
    function _unsubscribeToExecutor(uint256 strategyId_) internal {
        IDCAExecutor(_executor()).Unsubscribe(
            address(this),
            strategyId_,
            _strategies[strategyId_].interval
        );
        _strategies[strategyId_].active = false;
        _totalActiveStrategies--;
        emit StrategySubscription(strategyId_, _executor(), false);
    }

    /**
     * @dev logic to transfer the fee to the executor contract
     * @param feeAmount_ amount of the token to transfer as fee
     * @param tokenAddress_ token address of the payable fee token
     */
    function _transferFee(uint256 feeAmount_, address tokenAddress_) private {
        IERC20(tokenAddress_).safeTransfer(_executor(), feeAmount_);
    }

    /**
     * @notice REINVEST Logic
     */
    /**
     * @dev logic to execute a reinvest portion of the strategy
     * @notice Only working on call, not delegatecall
     * @param reinvest_ reinvest data struct of the strategy being executed
     * @param amount_ amount of the target token to reinvest
     */
    function _executeReinvest(
        Reinvest memory reinvest_,
        uint256 amount_
    ) internal returns (uint256 amount, bool success) {
        if (DCAREINVEST_LIBRARY.isActive()) {
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
                return (amount, success);
            }
        }
        return (0, false);
    }

    /**
     * @dev withdraws and unwinds a given amount of the reinvest amount
     * @param strategyId_ id of the strategy to be withdrawn
     * @param reinvest_ reinvest data struct of the strategy being withdrawn
     * @param amount_ amount of the liquidity token to unwind
     */
    function _withdrawReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_,
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

            // Only mutate accounting when the module actually unwound
            // the position. A delegatecall that succeeds at the EVM
            // level can still report success=false from the module —
            // decrementing on that path corrupted the ledger (V0.9 fix).
            if (success) {
                _reinvestLiquidityTokenBalance[strategyId_] -= amount_;
                _targetBalances[
                    _strategies[strategyId_].targetToken.tokenAddress
                ] += amount;
            }
        }

        return (amount, success);
    }

    function _forceWithdrawReinvest(
        Reinvest memory reinvest_,
        address liquidityToken_
    ) internal returns (uint256 amount, bool success) {
        uint256 amount_ = IERC20(liquidityToken_).balanceOf(address(this));
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
        }
        return (amount, success);
    }

    /**
     * @dev set a new Reinvest contract address
     * @param newAddress_ the address of the new reinvest contract
     */
    function _setReinvestAddress(address newAddress_) internal {
        // require(newAddress_ != address(0), "Invalid Reinvest Library Address");
        DCAREINVEST_LIBRARY = IDCAReinvest(newAddress_);
        emit ReinvestLibraryChanged(newAddress_);
    }

    /**
     * @dev get the Reinvest Contract
     * @return the Reinvest Contract instance
     */
    function _getReinvestContract() internal view returns (IDCAReinvest) {
        return DCAREINVEST_LIBRARY;
    }

    /**
     * @notice Helpers Logic
     */

    /**
     * @dev Get the reinvest token balance for a strategy
     * @param strategyId_ Strategy Id of the strategy to get the balance for
     * @return {uint256} The reinvest token balance for the strategy
     */
    function getReinvestTokenBalance(
        uint256 strategyId_
    ) public view returns (uint256) {
        return _reinvestLiquidityTokenBalance[strategyId_];
    }

    /**
     * @dev returns UI data for strategy interval timing
     * @param strategyId_ Strategy Id of the strategy data to get
     * @return lastEx {uint256} time of last execution (seconds)
     * @return secondsLeft {uint256} seconds left till strategy is in window
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
        Interval inter = _strategies[strategyId_].interval;
        secondsLeft = inter.secondsLeftTillWindow(lastEx);
        checkReturn = secondsLeft == 0;
        return (lastEx, secondsLeft, checkReturn);
    }
}
