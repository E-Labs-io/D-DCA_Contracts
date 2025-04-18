# DCAAccount





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*      Distributed Cost Average Contracts************************************************                  V0.7  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### AddFunds

```solidity
function AddFunds(address token_, uint256 amount_) external nonpayable
```



*Fund the account with a base currency*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to deposit |

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

### ExecutorDeactivate

```solidity
function ExecutorDeactivate(uint256 strategyId_) external nonpayable
```

used by the Executor to remove failing strategies/out of funds strategies.

*Force unsubscribe the strategy from the executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### ForceUnwindReinvestPosition

```solidity
function ForceUnwindReinvestPosition(uint256 strategyId_, address liquidityToken_) external nonpayable returns (uint256 amountOfTargetReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| liquidityToken_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOfTargetReturned | uint256 | undefined |

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

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```



*Unsubscribes the given strategy from its executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### UnwindReinvest

```solidity
function UnwindReinvest(uint256 strategyId_) external nonpayable returns (uint256 amountOfTargetReturned)
```

repays the underlining token and return the target token

*Unwinds the reinvestment for the given strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | The id of the strategy to unwind |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOfTargetReturned | uint256 | undefined |

### WithdrawFunds

```solidity
function WithdrawFunds(address token_, uint256 amount_) external nonpayable
```



*Unfund account of a base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to withdraw |

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

### changeExecutor

```solidity
function changeExecutor(address executorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |

### changeReinvestLibrary

```solidity
function changeReinvestLibrary(address newLibraryAddress_) external nonpayable
```



*Updates the contract holding the reinvest logic*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress_ | address | address of the library contract to use |

### getAttachedReinvestLibraryAddress

```solidity
function getAttachedReinvestLibraryAddress() external view returns (address)
```



*Returns the address of the attached reinvest library*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address of the attached reinvest library |

### getAttachedReinvestLibraryVersion

```solidity
function getAttachedReinvestLibraryVersion() external view returns (string)
```



*Returns the version of the attached reinvest library*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The version of the attached reinvest library |

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

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```

Returns the executor address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The executor address |

### getReinvestTokenBalance

```solidity
function getReinvestTokenBalance(uint256 strategyId_) external view returns (uint256)
```



*Get the reinvest token balance for a strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to get the balance for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} The reinvest token balance for the strategy |

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

Removes the executor address




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

current swap functionality only allowing for Uniswap

*Updates the Uniswap SwapRouter Address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| swapRouter_ | address | New address for the Uniswap router |



## Events

### ExecutorAddressChange

```solidity
event ExecutorAddressChange(address indexed newAddress_)
```

Emitted when the executor address is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | The new executor address |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### ReinvestExecuted

```solidity
event ReinvestExecuted(uint256 indexed strategyId_, bool indexed success, uint256 amountReturned)
```

Emits when a Reinvest modula has been executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | the ID of the strategy executed |
| success `indexed` | bool | Wether the reinvest was successful |
| amountReturned  | uint256 | The amount returned by the Reinvest |

### ReinvestLibraryChanged

```solidity
event ReinvestLibraryChanged(address indexed newLibraryAddress)
```

Emits when the reinvest address has been changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | The address for the Library contract |

### ReinvestUnwound

```solidity
event ReinvestUnwound(uint256 indexed strategyId, uint256 amount)
```

Emited when a Reinvest is unwound



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId `indexed` | uint256 | The ID of the strategy |
| amount  | uint256 | The amount unwond and returned to the account |

### StrategyCreated

```solidity
event StrategyCreated(uint256 indexed strategyId_)
```

Emitted when a new strategy has been created



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | Id of the newly created strategy |

### StrategyExecuted

```solidity
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_, bool reInvested_)
```

Emitted when a strategy has been executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | the id for the executed strategy |
| amountIn_ `indexed` | uint256 | amount received from the swap |
| reInvested_  | bool | wether the strategy reinvested or not |

### StrategySubscription

```solidity
event StrategySubscription(uint256 indexed strategyId_, address indexed executor_, bool indexed subscribed_)
```

Emitted when the Strategy is confirmed to be subscribed to an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | ID of the strategy that has been subscribed |
| executor_ `indexed` | address | Address of the Executor contract subscribed to |
| subscribed_ `indexed` | bool | Wether the strategy is subscribed/unsubscribed to the executor |



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


