# DCAAccount









## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable
```



*Executes the given strategy with the given fee amount.      Can only be done by the executor.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | the id of the strategy to execute |
| feeAmount_ | uint16 | the amount of fee to pay to the executor |

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

### IntervalTimings

```solidity
function IntervalTimings(enum IDCADataStructures.Interval) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | enum IDCADataStructures.Interval | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### TestSwap

```solidity
function TestSwap(address baseToken_, address targetToken_, uint256 amount_) external nonpayable
```

ONLY FOR DEVELOPMENT

*swaps from base token for set amount into any amount of target token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | {address}  token address of the token to swap from |
| targetToken_ | address | {address} token address of the token to recieve |
| amount_ | uint256 | {uint256} amount returned from the swap |

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



## Events

### DCAExecutorChanged

```solidity
event DCAExecutorChanged(address newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_  | address | undefined |

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
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | the id fo the executed strategy |
| amountIn_ `indexed` | uint256 | amount received from the swap |

### StrategySubscribed

```solidity
event StrategySubscribed(uint256 strategyId_, address executor_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_  | uint256 | undefined |
| executor_  | address | undefined |

### StrategyUnsubscribed

```solidity
event StrategyUnsubscribed(uint256 strategyId_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_  | uint256 | undefined |



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


