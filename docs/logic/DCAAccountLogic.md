# DCAAccountLogic





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable returns (bool)
```

Triggered by the assigned executor to execute the given strategy



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Id for the Strategy to be executed |
| feeAmount_ | uint16 | amount of the strategy amount to be paid via fee (percent) |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | If the function was successful |

### ExecutorDeactivate

```solidity
function ExecutorDeactivate(uint256 strategyId_) external nonpayable
```

Ony callable by the DCAExecutor contract to remove the strategy from the executor

*used when a strategy runs out of funds to execute*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Id of the strategy to remove |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```

Allows the account owner to fund the account for strategy&#39;s

*the funds are not strategy specificMust approve the spend before calling this function*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | Address for the base token being funded |
| amount_ | uint256 | Amount of the token to be deposited |

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

Used by the account owner to subscribe the strategy to the executor

*the Account needs to have 5 executions worth of funds to be subscribed*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | The Id of the strategy to subscribe to the executor |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```

Removes a given amount from the Address of the given base token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | Address of the base token to remove from the contract |
| amount_ | uint256 | Amount of the base token to remove from the address |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```

Used by the account owner to unsubscribe the strategy to the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | ID of the strategy to unsubscribe |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```

Removes a given amount from the Address of the given target token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | Address of the target token to remove from the account |
| amount_ | uint256 | Amount of the target token to remove from the account |

### changeExecutor

```solidity
function changeExecutor(address executorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |

### getBaseBalance

```solidity
function getBaseBalance(address token_) external nonpayable returns (uint256)
```

Gets Account balance of the provided base token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | Address for the token to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Amount of that token in the account |

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```

Returns the executor address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The executor address |

### getTargetBalance

```solidity
function getTargetBalance(address token_) external nonpayable returns (uint256)
```

Gets Account balance of the provided target token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | Address for the token to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Amount of that token in the account |

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
event ReinvestUnwound(uint256 indexed strategyId, uint256 amount, bool indexed success)
```

Emited when a Reinvest is unwound



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId `indexed` | uint256 | The ID of the strategy |
| amount  | uint256 | The amount unwond and returned to the account |
| success `indexed` | bool | If the unwind was successful |

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

### StrategySubscribed

```solidity
event StrategySubscribed(uint256 indexed strategyId_, address indexed executor_)
```

Emitted when the Strategy is confirmed to be subscribed to an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | ID of the strategy that has been subscribed |
| executor_ `indexed` | address | Address of the Executor contract subscribed to |

### StrategyUnsubscribed

```solidity
event StrategyUnsubscribed(uint256 indexed strategyId_)
```

Emitted when a strategy has been unsubscribed from an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | Id of the strategy being unsubscribed |



## Errors

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


