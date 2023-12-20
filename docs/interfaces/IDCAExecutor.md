# IDCAExecutor









## Methods

### DistributeFees

```solidity
function DistributeFees(address tokenAddress) external nonpayable
```

Distributes the acuminated fee&#39;s from the DCAExecutor

*will use the in-contract fee&#39;s data to split the funds and transfer to needed wallets.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | {address} Address of the token in the fee&#39;s pool to be distributed |

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



## Events

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

### ExecutionEOAAddressChange

```solidity
event ExecutionEOAAddressChange(address indexed newExecutionEOA_, address changer_)
```

emitted when the default Executor service address is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newExecutionEOA_ `indexed` | address | {address} the new address of the Executor Service EOA or Multi |
| changer_  | address | {address} address of the wallet implementing change |

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



