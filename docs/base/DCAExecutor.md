# DCAExecutor





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*      Distributed Cost Average Contracts************************************************                  V0.7  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### DistributeFees

```solidity
function DistributeFees(address tokenAddress_) external nonpayable
```



*Distributes the fees for the given token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress_ | address | The address of the token to distribute fees for |

### Execute

```solidity
function Execute(address DCAAccount_, uint256 strategyId_, enum IDCADataStructures.Interval interval_) external nonpayable
```



*Executes a single strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | The address of the DCAAccount |
| strategyId_ | uint256 | The id of the strategy to execute |
| interval_ | enum IDCADataStructures.Interval | The interval of the strategy to execute |

### ForceUnsubscribe

```solidity
function ForceUnsubscribe(address DCAAccount_, uint256 strategyId_, enum IDCADataStructures.Interval interval_) external nonpayable
```



*Forces the unsubscription of a strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | The address of the DCAAccount |
| strategyId_ | uint256 | The id of the strategy to unsubscribe |
| interval_ | enum IDCADataStructures.Interval | The interval of the strategy to unsubscribe |

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
function Unsubscribe(address DCAAccountAddress_, uint256 strategyId_, enum IDCADataStructures.Interval interval_) external nonpayable
```



*Unsubscribes a strategy from the DCAExecutor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ | address | The address of the DCAAccount |
| strategyId_ | uint256 | The id of the strategy to unsubscribe |
| interval_ | enum IDCADataStructures.Interval | The interval of the strategy to unsubscribe |

### addAdmin

```solidity
function addAdmin(address newAdmin_) external nonpayable
```

Adds an admin to the contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAdmin_ | address | The address to add as an admin |

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

Checks if an address is an admin



#### Parameters

| Name | Type | Description |
|---|---|---|
| addressToCheck_ | address | The address to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the address is an admin, false otherwise |

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```



*Returns the active executor address*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The active executor address |

### getFeeData

```solidity
function getFeeData() external view returns (struct IDCADataStructures.FeeDistribution)
```



*Returns the fee data for the DCAExecutor*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.FeeDistribution | The fee data |

### getIntervalTotalActiveStrategies

```solidity
function getIntervalTotalActiveStrategies(enum IDCADataStructures.Interval interval_) external view returns (uint256)
```



*Returns the total number of active strategies for the given interval*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | The interval to get the total number of active strategies for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total number of active strategies for the given interval |

### getTimeTillWindow

```solidity
function getTimeTillWindow(address account_, uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```



*Returns the time till window for the given DCAAccount and strategy id*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account_ | address | The address of the DCAAccount |
| strategyId_ | uint256 | The id of the strategy |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | The last execution block number |
| secondsLeft | uint256 | The seconds left till window |
| checkReturn | bool | The check return |

### getTotalActiveStrategys

```solidity
function getTotalActiveStrategys() external view returns (uint256)
```



*Returns the total number of active strategies*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total number of active strategies |

### getTotalExecutions

```solidity
function getTotalExecutions() external view returns (uint256)
```



*Returns the total number of executions*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total number of executions |

### isActive

```solidity
function isActive() external view returns (bool)
```

Returns the active state of the contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | isActive True if the contract is active, false otherwise |

### isIntervalActive

```solidity
function isIntervalActive(enum IDCADataStructures.Interval interval_) external view returns (bool)
```



*Returns the active state of the given interval*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | The interval to get the active state for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | The active state of the given interval |

### isTokenAllowedAsBase

```solidity
function isTokenAllowedAsBase(address token_) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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

Removes an admin from the contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| oldAdmin_ | address | The address to remove as an admin |

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


### setActiveState

```solidity
function setActiveState(bool newFlag_) external nonpayable
```



*Sets the active state of the DCAExecutor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newFlag_ | bool | The new active state |

### setBaseTokenAllowance

```solidity
function setBaseTokenAllowance(address token_, bool allowed_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| allowed_ | bool | undefined |

### setFeeData

```solidity
function setFeeData(IDCADataStructures.FeeDistribution fee_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| fee_ | IDCADataStructures.FeeDistribution | undefined |

### setIntervalActive

```solidity
function setIntervalActive(enum IDCADataStructures.Interval interval_, bool status_) external nonpayable
```



*Sets the active state of the given interval*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | The interval to set the active state for |
| status_ | bool | The new active state |

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

### BaseTokenAllowanceChanged

```solidity
event BaseTokenAllowanceChanged(address token_, bool allowed_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_  | address | undefined |
| allowed_  | bool | undefined |

### ContractActiveStateChange

```solidity
event ContractActiveStateChange(bool indexed active_)
```

Emitted when the active state of the contract is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| active_ `indexed` | bool | The new active state |

### ExecutedStrategy

```solidity
event ExecutedStrategy(address indexed account_, uint256 indexed strategyId_)
```

Emitted once a strategy has finished executing successfully



#### Parameters

| Name | Type | Description |
|---|---|---|
| account_ `indexed` | address | Address of the DCAAccount |
| strategyId_ `indexed` | uint256 | ID of the strategy executed |

### ExecutorAddressChange

```solidity
event ExecutorAddressChange(address indexed newAddress_)
```

Emitted when the executor address is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | The new executor address |

### FeeDataChanged

```solidity
event FeeDataChanged()
```






### FeesDistributed

```solidity
event FeesDistributed(address indexed token_, uint256 indexed amount_)
```

Emitted each time the protocol fees are distributed



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ `indexed` | address | address of the token being distributed |
| amount_ `indexed` | uint256 | amount of the total token distributed |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### StrategySubscription

```solidity
event StrategySubscription(address indexed DCAAccountAddress_, uint256 indexed strategyId_, enum IDCADataStructures.Interval strategyInterval_, bool indexed active_)
```

Emitted when a new strategy subscribes or unsubscribes to the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ `indexed` | address | address of the DCAAccount subscribing |
| strategyId_ `indexed` | uint256 | ID of the strategy to (un-)subscribe |
| strategyInterval_  | enum IDCADataStructures.Interval | Interval state of how ofter to be executed |
| active_ `indexed` | bool | wether the strategy is being subscribed (true) or unsubscribed (false) |



## Errors

### ContractIsPaused

```solidity
error ContractIsPaused()
```

Error thrown when the contract is paused




### NotAllowedBaseToken

```solidity
error NotAllowedBaseToken(address token_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

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


