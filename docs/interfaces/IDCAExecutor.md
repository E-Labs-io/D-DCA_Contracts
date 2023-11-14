# IDCAExecutor









## Methods

### DistributeFees

```solidity
function DistributeFees(address tokenAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | undefined |

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

### DCAAccountSubscription

```solidity
event DCAAccountSubscription(address DCAAccountAddress_, uint256 strategyId_, bool active_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| DCAAccountAddress_  | address | undefined |
| strategyId_  | uint256 | undefined |
| active_  | bool | undefined |

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



