# DCAAccount









## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint256 feeAmount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| feeAmount_ | uint256 | undefined |

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
function FundAccount(contract IERC20 token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |
| amount_ | uint256 | undefined |

### GetBaseTokenCostPerBlock

```solidity
function GetBaseTokenCostPerBlock(contract IERC20 baseToken_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | contract IERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetBaseTokenRemainingBlocks

```solidity
function GetBaseTokenRemainingBlocks(contract IERC20 baseToken_) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | contract IERC20 | undefined |

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
function SubscribeStrategy(uint256 strategyId_) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

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

### StratogyExecuted

```solidity
event StratogyExecuted(uint256 strategyId_)
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


