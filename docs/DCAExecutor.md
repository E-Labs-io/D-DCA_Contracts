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

### Execute

```solidity
function Execute(enum IDCADataStructures.Interval interval_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | undefined |

### ForceFeeFund

```solidity
function ForceFeeFund() external nonpayable
```






### GetIntervalsStrategys

```solidity
function GetIntervalsStrategys(enum IDCADataStructures.Interval interval_) external view returns (struct IDCADataStructures.Strategy[])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.Strategy[] | undefined |

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
function Unsubscribe(IDCADataStructures.Strategy strategy_) external nonpayable returns (bool sucsess)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategy_ | IDCADataStructures.Strategy | undefined |

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

### DCAAccontSubscription

```solidity
event DCAAccontSubscription(IDCADataStructures.Strategy interval_, bool active_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_  | IDCADataStructures.Strategy | undefined |
| active_  | bool | undefined |

### ExecutedDCA

```solidity
event ExecutedDCA(enum IDCADataStructures.Interval indexed interval_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ `indexed` | enum IDCADataStructures.Interval | undefined |

### ExecutionEOAAddressChange

```solidity
event ExecutionEOAAddressChange(address newExecutionEOA_, address changer_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newExecutionEOA_  | address | undefined |
| changer_  | address | undefined |

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


