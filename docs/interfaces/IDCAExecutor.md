# IDCAExecutor





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*      Distributed Cost Average Contracts************************************************                  V0.7  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



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
function Execute(address DCAAccount_, uint256 strategyId_, enum IDCADataStructures.Interval interval_) external nonpayable
```

Called by the external Executor service wallet only, triggers the specified strategy



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | {address} Address of the DCAAccount holding the strategy to execute |
| strategyId_ | uint256 | {uint256} ID of the strategy to execute |
| interval_ | enum IDCADataStructures.Interval | {Interval} Interval of the strategy to execute |

### ForceUnsubscribe

```solidity
function ForceUnsubscribe(address DCAAccount_, uint256 strategyId_, enum IDCADataStructures.Interval interval_) external nonpayable
```

Used by the Executor service to remove a strategy from the DCAExecutor Used mostly for unfunded and failing accounts.



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccount_ | address | {address} Address of the DCAAccount to be unsubscribed |
| strategyId_ | uint256 | {uint256} ID of the strategy to be unsubscribed |
| interval_ | enum IDCADataStructures.Interval | undefined |

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

Called by the DCAAccount to remove itself from the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_ | address | Address of the unsubscribing DCAAccount |
| strategyId_ | uint256 | ID of the strategy being unsubscribed |
| interval_ | enum IDCADataStructures.Interval | undefined |

### getTimeTillWindow

```solidity
function getTimeTillWindow(address account_, uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account_ | address | undefined |
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | undefined |
| secondsLeft | uint256 | undefined |
| checkReturn | bool | undefined |

### setIntervalActive

```solidity
function setIntervalActive(enum IDCADataStructures.Interval interval_, bool status_) external nonpayable
```

Allows the admin to turn Strategy timings on &amp; off



#### Parameters

| Name | Type | Description |
|---|---|---|
| interval_ | enum IDCADataStructures.Interval | The strategy interval |
| status_ | bool | if the interval is active or not |



## Events

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



