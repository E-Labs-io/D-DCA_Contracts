# DCAExecutor









## Methods

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

Called by the external Executor service wallet only, triggers the specified strategy



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | {address} Address of the DCAAccount holding the strategy to execute |
| strategyId_ | uint256 | {uint256} ID of the strategy to execute |

### ExecuteBatch

```solidity
function ExecuteBatch(address[] DCAAccount_, uint256[] strategyId_) external nonpayable
```

Called by the external Executor service wallet only, triggers the specified strategy&#39;s

*testing for now, will execute a max of 10 strategies at a time*

#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address[] | {address[]} Address of the DCAAccount holding the strategy to execute |
| strategyId_ | uint256[] | {uint256[]} ID of the strategy to execute |

### ForceUnsubscribe

```solidity
function ForceUnsubscribe(address DCAAccount_, uint256 strategyId_) external nonpayable
```

Used by the Executor service to remove a strategy from the DCAExecutor      Used mostly for unfunded and failing accounts.



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | {address} Address of the DCAAccount to be unsubscribed |
| strategyId_ | uint256 | {uint256} ID of the strategy to be unsubscribed |

### Subscribe

```solidity
function Subscribe(IDCADataStructures.Strategy strategy_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategy_ | IDCADataStructures.Strategy | undefined |

### Unsubscribe

```solidity
function Unsubscribe(address DCAAccountAddress_, uint256 strategyId_) external nonpayable
```

Called by the DCAAccount to remove itself from the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ | address | Address of the unsubscribing DCAAccount |
| strategyId_ | uint256 | ID of the strategy being unsubscribed |

### addAdmin

```solidity
function addAdmin(address newAdmin_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAdmin_ | address | undefined |

### changeExecutor

```solidity
function changeExecutor(address executorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |

### checkIfAdmin

```solidity
function checkIfAdmin(address addressToCheck_) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| addressToCheck_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### getActiveExecutorAddress

```solidity
function getActiveExecutorAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getFeeData

```solidity
function getFeeData() external view returns (struct IDCADataStructures.FeeDistribution)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.FeeDistribution | undefined |

### getSpecificStrategy

```solidity
function getSpecificStrategy(address dcaAccountAddress_, uint256 accountStrategyId_) external view returns (struct IDCADataStructures.Strategy)
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

### getTotalActiveStrategys

```solidity
function getTotalActiveStrategys() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getTotalExecutions

```solidity
function getTotalExecutions() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### removeExecutor

```solidity
function removeExecutor() external nonpayable
```






### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### setActiveState

```solidity
function setActiveState(bool newState_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newState_ | bool | undefined |

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

### ContractActiveStateChange

```solidity
event ContractActiveStateChange(bool indexed newState_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newState_ `indexed` | bool | undefined |

### DCAAccountSubscription

```solidity
event DCAAccountSubscription(address indexed DCAAccountAddress_, uint256 indexed strategyId_, enum IDCADataStructures.Interval strategyInterval_, bool indexed active_)
```

Emitted when a new strategy subscribes or unsubscribes to the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ `indexed` | address | {address} address of the DCAAccount subscribing |
| strategyId_ `indexed` | uint256 | {uint256} ID of the strategy to (un-)subscribe |
| strategyInterval_  | enum IDCADataStructures.Interval | {Interval} Interval state of how ofter to be executed |
| active_ `indexed` | bool | {bool} wether the strategy is being subscribed (true) or unsubscribed (false) |

### ExecutedDCA

```solidity
event ExecutedDCA(address indexed account_, uint256 indexed strategyId_)
```

Emitted once a strategy has finished executing



#### Parameters

| Name | Type | Description |
|---|---|---|
| account_ `indexed` | address | {address} Address of the DCAAccount |
| strategyId_ `indexed` | uint256 | {uint256} ID of teh strategy executed |

### ExecutorAddressChange

```solidity
event ExecutorAddressChange(address indexed newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | undefined |

### FeesDistributed

```solidity
event FeesDistributed(address indexed token_, uint256 indexed amount_)
```

Emitted each time the protocol fees are distributed



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ `indexed` | address | {address} address of the token being distributed |
| amount_ `indexed` | uint256 | {uint256} amount of the total token distributed |

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


