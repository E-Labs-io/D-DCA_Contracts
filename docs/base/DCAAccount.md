# DCAAccount





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable returns (bool)
```



*Executes the given strategy with the given fee amount.      Can only be done by the executor.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | the id of the strategy to execute |
| feeAmount_ | uint16 | the amount of fee to pay to the executor |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### ExecutorDeactivateStrategy

```solidity
function ExecutorDeactivateStrategy(uint256 strategyId_) external nonpayable
```

used by the Executor to remove failing strategies/out of funds strategies.

*Force unsubscribe the strategy from the executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```



*Fund the account with a base currency*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to deposit |

### SWAP

```solidity
function SWAP(address baseToken_, address targetToken_, uint256 amount_) external nonpayable
```

ONLY IN CONTRACT FOR DEVELOPMENT, WILL REMOVE ON PUBLIC DEPLOY



#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | address of the basetoken |
| targetToken_ | address | address of the target token |
| amount_ | uint256 | amount of the base token to swap into the target token |

### SWAP_ROUTER

```solidity
function SWAP_ROUTER() external view returns (contract ISwapRouter)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ISwapRouter | undefined |

### SetupStrategy

```solidity
function SetupStrategy(IDCADataStructures.Strategy newStrategy_, uint256 seedFunds_, bool subscribeToExecutor_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newStrategy_ | IDCADataStructures.Strategy | undefined |
| seedFunds_ | uint256 | undefined |
| subscribeToExecutor_ | bool | undefined |

### SubscribeStrategy

```solidity
function SubscribeStrategy(uint256 strategyId_) external nonpayable
```



*Subscribes an already created strategy to an executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} Id of the strategy to subscribe to an executor |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```



*Unfund account of a base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to withdraw |

### UnWindReinvest

```solidity
function UnWindReinvest(uint256 strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```



*Unsubscribes the given strategy from its executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```



*Withdraws the given amount of the target token balance*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the target token to withdraw |

### changeDCAReinvestLibrary

```solidity
function changeDCAReinvestLibrary(address newLibraryAddress_) external nonpayable
```



*Updates the contract holding the reinvest logic*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress_ | address | address of the library contract to use |

### changeExecutor

```solidity
function changeExecutor(address executorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |

### getAttachedReinvestLibraryAddress

```solidity
function getAttachedReinvestLibraryAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getAttachedReinvestLibraryVersion

```solidity
function getAttachedReinvestLibraryVersion() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### getBaseBalance

```solidity
function getBaseBalance(address token_) external view returns (uint256)
```



*get account balance of base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} account balance of Base token |

### getBaseTokenCostPerBlock

```solidity
function getBaseTokenCostPerBlock(address token_) external view returns (uint256)
```



*get the total cost per-block for all strategies using the base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} amount of the base token strategies use per block |

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getStrategyData

```solidity
function getStrategyData(uint256 strategyId_) external view returns (struct IDCADataStructures.Strategy)
```



*Get the full data for the given strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy data to get |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.Strategy | {Strategy} the given strategy&#39;s full data struct |

### getTargetBalance

```solidity
function getTargetBalance(address token_) external view returns (uint256)
```



*get account balance of target token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} account balance of Base token |

### getTimeTillWindow

```solidity
function getTimeTillWindow(uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```



*returns UI data for strategy interval timing*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy data to get |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | {uint256} time of last execution (seconds) |
| secondsLeft | uint256 | {uint256} seconds left till strategy is in window |
| checkReturn | bool | {bool} if the strategy is in the window |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### removeExecutor

```solidity
function removeExecutor() external nonpayable
```






### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### setStrategyReinvest

```solidity
function setStrategyReinvest(uint256 strategyId_, IDCADataStructures.Reinvest reinvest_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| reinvest_ | IDCADataStructures.Reinvest | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateSwapAddress

```solidity
function updateSwapAddress(address swapRouter_) external nonpayable
```



*Updates the Uniswap SwapRouter Address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| swapRouter_ | address | New address for the Uniswap router |



## Events

### DCAReinvestLibraryChanged

```solidity
event DCAReinvestLibraryChanged(address indexed newLibraryAddress)
```

Emits when the reinvest address has been changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | ne address for the Library contract |

### ExecutorAddressChange

```solidity
event ExecutorAddressChange(address indexed newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | undefined |

### NewStrategyCreated

```solidity
event NewStrategyCreated(uint256 indexed strategyId_)
```

Emitted when a new strategy has been created



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} Id of the newly created strategy |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### StrategyExecuted

```solidity
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_, bool reInvested_)
```

Emitted when a strategy has been executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} the id for the executed strategy |
| amountIn_ `indexed` | uint256 | {uint256} amount received from the swap |
| reInvested_  | bool | {bool} wether the strategy reinvested or not |

### StrategyReinvestExecuted

```solidity
event StrategyReinvestExecuted(uint256 indexed strategyId_, bool indexed success, uint256 amountReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |
| success `indexed` | bool | undefined |
| amountReturned  | uint256 | undefined |

### StrategyReinvestUnwound

```solidity
event StrategyReinvestUnwound(uint256 indexed strategyId, uint256 amount, bool indexed success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId `indexed` | uint256 | undefined |
| amount  | uint256 | undefined |
| success `indexed` | bool | undefined |

### StrategySubscribed

```solidity
event StrategySubscribed(uint256 indexed strategyId_, address indexed executor_)
```

Emitted when the Strategy is confirmed to be subscribed to an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} ID of the strategy that has been subscribed |
| executor_ `indexed` | address | {address} Address of the Executor contract subscribed to |

### StrategyUnsubscribed

```solidity
event StrategyUnsubscribed(uint256 indexed strategyId_)
```

Emitted when a strategy has been unsubscribed from an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} Id of the strategy being unsubscribed |



## Errors

### AddressEmptyCode

```solidity
error AddressEmptyCode(address target)
```



*There&#39;s no code at `target` (it is not a contract).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| target | address | undefined |

### AddressInsufficientBalance

```solidity
error AddressInsufficientBalance(address account)
```



*The ETH balance of the account is not enough to perform the operation.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### FailedInnerCall

```solidity
error FailedInnerCall()
```



*A call to an address target failed. The target may have reverted.*


### OwnableInvalidOwner

```solidity
error OwnableInvalidOwner(address owner)
```



*The owner is not a valid owner account. (eg. `address(0)`)*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

### OwnableUnauthorizedAccount

```solidity
error OwnableUnauthorizedAccount(address account)
```



*The caller account is not authorized to perform an operation.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### SafeERC20FailedOperation

```solidity
error SafeERC20FailedOperation(address token)
```



*An operation with an ERC20 token failed.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | undefined |


