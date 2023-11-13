# IDCAExecutor









## Methods

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



