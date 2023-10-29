// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/DCADataStructures.sol";

contract DCAAccount is Ownable, IDCAAccount {
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

    DCAExecutor internal _executorAddress;
    ISwapRouter public immutable SWAP_ROUTER;

    uint24 private _poolFee = 3000;

    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    event StratogyExecuted(uint256 strategyId_);
    event DCAExecutorChanged(DCAExecutor newAddress_);
    event StratogySubscribed(uint256 strategyId_, DCAExecutor executor_);
    event StratogyUnsubscribed(uint256 strategyId_);

    constructor() {}

    function Execute(uint256 strategyId_) public OnlyExecutor {
        _executeDCATrade(strategyId_);
    }

    function SetupStratogy(
        Strategy calldata newStrategy_,
        uint256 seedFunds_,
        bool subscribeToEcecutor_
    ) public onlyOwner {
        //Adds a new strategy to the system
        //Transfers the given amount of the base token to the account
        //If true subscribes the strategy to the default executor
        newStrategy_.strategyId = strategies_.length;
        strategies_.push(newStrategy_);

        if (seedFunds_ > 0) {
            IERC20(newStrategy_.baseToken).transferFrom(
                owner(),
                address(this),
                seedFunds_
            );
            _baseBalances[newStrategy_.baseToken] += seedFund_;
        }

        if(subscribeToEcecutor_){
            _subscribeToExecutor(newStrategy_);
        }
    }

    function SubscribeStratogy(
        uint256 stratogyId_
    ) public onlyOwner returns (bool success) {
        //Add the given strategy, once checking there are funds
        //to the default DCAExecutor
    }

    function UnsubscribeStratogy(
        uint256 stratogyId_
    ) public onlyOwner returns (bool success) {
        //remove the given strategy from its active executor
    }

    function FundAccount(IERC20 token_, uint256 amount_) public onlyOwner {
        //Transfer the given amount of the given ERC20 token to the DCAAccount
    }

    function _executeDCATrade(
        uint256 strategyId_
    ) internal returns (bool success) {
        //Example of how this might work using Uniswap
        //Get the stragegy
        Strategy memory selectedStrat = strategies_[strategyId_];

        //Check the strategy is active
        //Check there is the balance
        if (!strategies_.active) return success = false;
        if (_baseBalances[selectedStrat.baseToken] < selectedStrat.amount)
            return success = false;

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(
            selectedStrat.baseToken,
            address(SWAP_ROUTER),
            selectedStrat.amount
        );

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: selectedStrat.baseToken,
                tokenOut: selectedStrat.targetToken,
                fee: _poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: selectedStrat.amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        // Update balance & timetrack
        uint256 amountOut = swapRouter.exactInputSingle(params);
        _targetBalances[selectedStrat.baseToken] += amountOut;
        _baseBalances[selectedStrat.targetToken] -= selectedStrat.amount;
        _lastExecution[selectedStrat.strategyId] = block.timestamp;

        return success = true;
    }

    function _subscribeToExecutor(Strategy calldata newStrategy_,) private {}
}
