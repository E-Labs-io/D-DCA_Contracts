// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "../utils/swap.sol";
import {Strategies, Intervals} from "../library/Strategys.sol";
import {Fee} from "../library/Fees.sol";

import {IDCAAccount} from "../interfaces/IDCAAccount.sol";
import {DCAReinvestLogic, DCAReinvest} from "../base/DCAReinvest.sol";
import {OnlyExecutor} from "../security/onlyExecutor.sol";
import {IDCAExecutor} from "../interfaces/IDCAExecutor.sol";

abstract contract DCAAccountLogic is Swap, OnlyExecutor, IDCAAccount {
    using Fee for uint16;
    using Strategies for Strategy;
    using Intervals for Interval;

    mapping(uint256 => Strategy) internal _strategies;

    mapping(address => uint256) internal _baseBalances;
    mapping(address => uint256) internal _targetBalances;
    mapping(uint256 => uint256) internal _reinvestLiquidityTokenBalance; // strat Id to balance of liquidity token

    mapping(uint256 => uint256) internal _lastExecution; // strategyId to block number
    mapping(address => uint256) internal _costPerBlock; //  Base currency

    uint256 internal _totalIntervalsExecuted;
    uint256 internal _totalActiveStrategies;
    uint256 internal _strategyCount;

    DCAReinvest private DCAREINVEST_LIBRARY;

    /**
     * @dev Modifier to check if a strategy is within the allowed execution window
     * @param strategyId_ {uint256} Id of the strategy to check if is in window
     */

    modifier inWindow(uint256 strategyId_) {
        require(
            _strategies[strategyId_].interval.isInWindow(
                _lastExecution[strategyId_]
            ),
            "DCAAccount : [inWindow] Strategy Interval not met"
        );
        _;
    }

    /**
     * @notice EXECUTE Logic
     */

    /**
     * @dev logic for executing a strategy
     * @param strategyId_ Strategy Id of the strategy data to execute
     * @param feePercent_ Amount to charge as fee in percent
     * @notice percent breakdown where 10000 = 100%, 100 = 1%, etc.
     * @return {bool} if the execution was sucsessful
     */
    function _executeDCATrade(
        uint256 strategyId_,
        uint16 feePercent_
    ) internal returns (bool) {
        Strategy memory strategy = _strategies[strategyId_];
        uint256 fee = feePercent_.getFee(strategy.amount);
        uint256 tradeAmount = strategy.amount - fee;

        if (feePercent_ > 0) {
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
    function _subscribeToExecutor(Strategy memory strategyData_) internal {
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
    function _unsubscribeToExecutor(uint256 strategyId_) internal {
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
     * @dev logic to transfer the fee to the executor contract
     * @param feeAmount_ amount of the token to transfer as fee
     * @param tokenAddress_ token address of the payable fee token
     */
    function _transferFee(uint256 feeAmount_, address tokenAddress_) private {
        // Transfer teh fee to the DCAExecutpr
        require(
            IERC20(tokenAddress_).transfer(_executor(), feeAmount_),
            "Fee transfer failed"
        );
    }

    /**
     * @notice REINVEST Logic
     */
    /**
     * @dev logic to execute a reinvest portion of the strategy
     * @notice Only working on call, not delegatecall
     * @param strategyId_ id of the strategy being executed
     * @param reinvest_ reinvest data struct of the strategy being executed
     * @param amount_ amount of the target   token to reinvest
     */
    function _executeReinvest(
        uint256 strategyId_,
        Reinvest memory reinvest_,
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
            _reinvestLiquidityTokenBalance[strategyId_] -= amount_;
            _targetBalances[
                _strategies[strategyId_].targetToken.tokenAddress
            ] += amount;

            return (amount, success);
        }

        return (amount, success);
    }
    /**
     * @dev set a new Reinvest contract address
     * @param newAddress_ the address of the new reinvest contract
     */
    function _setReinvestAddress(address newAddress_) internal {
        DCAREINVEST_LIBRARY = DCAReinvest(newAddress_);
    }
    /**
     * @dev get the Reinvest Contract
     * @return the Reinvest Contract instance
     */
    function _getReinvestContract() internal view returns (DCAReinvest) {
        return DCAREINVEST_LIBRARY;
    }

    /**
     * @notice cost & fee calculations Logic
     */

    /**
     * @dev calculate cost per block for the given interval & amount of spot sell
     * @param amount_ amount of the token
     * @param interval_ execution interval
     */
    function _calculateCostPerBlock(
        uint256 amount_,
        Interval interval_
    ) internal pure returns (uint256) {
        return amount_ / interval_.intervalToBlockAmount();
    }
    /**
     * @notice Helpers Logic
     */

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
        Interval inter = _strategies[strategyId_].interval;
        secondsLeft = inter.secondsLeftTillWindow(lastEx);
        return (lastEx, secondsLeft, secondsLeft == 0);
    }
}
