# DCAAccount









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





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |

### GetBaseBalance

```solidity
function GetBaseBalance(address token_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetBaseTokenCostPerBlock

```solidity
function GetBaseTokenCostPerBlock(address baseToken_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetBaseTokenRemainingBlocks

```solidity
function GetBaseTokenRemainingBlocks(address baseToken_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetStrategyData

```solidity
function GetStrategyData(uint256 strategyId_) external view returns (struct IDCADataStructures.Strategy)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.Strategy | undefined |

### GetTargetBalance

```solidity
function GetTargetBalance(address token_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### SWAP

```solidity
function SWAP(address baseToken_, address targetToken_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | undefined |
| targetToken_ | address | undefined |
| amount_ | uint256 | undefined |

### SetStrategyReinvest

```solidity
function SetStrategyReinvest(uint256 strategyId_, IDCADataStructures.Reinvest reinvest_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| reinvest_ | IDCADataStructures.Reinvest | undefined |

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





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |

### changeExecutor

```solidity
function changeExecutor(address newExecutorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newExecutorAddress_ | address | undefined |

### getTimeTillWindow

```solidity
function getTimeTillWindow(uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | undefined |
| secondsLeft | uint256 | undefined |
| checkReturn | bool | undefined |

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





#### Parameters

| Name | Type | Description |
|---|---|---|
| swapRouter_ | address | undefined |



## Events

### DCAExecutorChanged

```solidity
event DCAExecutorChanged(address indexed newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | undefined |

### NewStrategyCreated

```solidity
event NewStrategyCreated(uint256 indexed strategyId_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |

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
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_, bool reInvest_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | the id fo the executed strategy |
| amountIn_ `indexed` | uint256 | amount received from the swap |
| reInvest_  | bool | undefined |

### StrategySubscribed

```solidity
event StrategySubscribed(uint256 indexed strategyId_, address indexed executor_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |
| executor_ `indexed` | address | undefined |

### StrategyUnsubscribed

```solidity
event StrategyUnsubscribed(uint256 indexed strategyId_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |



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


