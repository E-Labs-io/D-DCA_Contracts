# IDCAAccount









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

### FundAccount

```solidity
function FundAccount(contract IERC20 token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |
| amount_ | uint256 | undefined |

### SetupStrategy

```solidity
function SetupStrategy(IDCADataStructures.Strategy newStrategy_, uint256 seedFunds_, bool subscribeToEcecutor_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newStrategy_ | IDCADataStructures.Strategy | undefined |
| seedFunds_ | uint256 | undefined |
| subscribeToEcecutor_ | bool | undefined |

### SubscribeStrategy

```solidity
function SubscribeStrategy(uint256 stratogyId_) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| stratogyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 stratogyId) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| stratogyId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |



## Events

### DCAExecutorChanged

```solidity
event DCAExecutorChanged(address newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_  | address | undefined |

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



