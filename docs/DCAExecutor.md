# DCAExecutor









## Methods

### CheckIfAdmin

```solidity
function CheckIfAdmin(address addressToCheck_) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| addressToCheck_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### DistributeFees

```solidity
function DistributeFees(address tokenAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress_ | address | undefined |

### Execute

```solidity
function Execute(address DCAAccount_, uint256 strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | undefined |
| strategyId_ | uint256 | undefined |

### ExecuteBatch

```solidity
function ExecuteBatch(address[] DCAAccount_, uint256[] strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address[] | undefined |
| strategyId_ | uint256[] | undefined |

### ForceUnsubscribe

```solidity
function ForceUnsubscribe(address DCAAccount_, uint256 strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | undefined |
| strategyId_ | uint256 | undefined |

### GetSpesificStrategy

```solidity
function GetSpesificStrategy(address dcaAccountAddress_, uint256 accountStrategyId_) external view returns (struct IDCADataStructures.Strategy)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| dcaAccountAddress_ | address | undefined |
| accountStrategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.Strategy | undefined |

### GetTotalActiveStrategys

```solidity
function GetTotalActiveStrategys() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### Subscribe

```solidity
function Subscribe(IDCADataStructures.Strategy strategy_) external nonpayable returns (bool sucsess)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategy_ | IDCADataStructures.Strategy | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| sucsess | bool | undefined |

### Unsubscribe

```solidity
function Unsubscribe(address DCAAccountAddress_, uint256 strategyId_) external nonpayable returns (bool sucsess)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ | address | undefined |
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| sucsess | bool | undefined |

### addAdmin

```solidity
function addAdmin(address newAdmin_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAdmin_ | address | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### removeAdmin

```solidity
function removeAdmin(address oldAdmin_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| oldAdmin_ | address | undefined |

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

### DCAAccountSubscription

```solidity
event DCAAccountSubscription(address indexed DCAAccountAddress_, uint256 indexed strategyId_, enum IDCADataStructures.Interval strategyInterval_, bool indexed active_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ `indexed` | address | undefined |
| strategyId_ `indexed` | uint256 | undefined |
| strategyInterval_  | enum IDCADataStructures.Interval | undefined |
| active_ `indexed` | bool | undefined |

### ExecutedDCA

```solidity
event ExecutedDCA(address indexed account_, uint256 indexed strategyId_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account_ `indexed` | address | undefined |
| strategyId_ `indexed` | uint256 | undefined |

### ExecutionEOAAddressChange

```solidity
event ExecutionEOAAddressChange(address indexed newExecutionEOA_, address changer_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newExecutionEOA_ `indexed` | address | undefined |
| changer_  | address | undefined |

### FeesDistributed

```solidity
event FeesDistributed(address indexed token_, uint256 indexed amount_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ `indexed` | address | undefined |
| amount_ `indexed` | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



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


