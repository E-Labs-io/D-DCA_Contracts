# IDCAAccount









## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| feeAmount_ | uint16 | undefined |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |

### GetBaseBalance

```solidity
function GetBaseBalance(address token_) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetTargetBalance

```solidity
function GetTargetBalance(address token_) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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
function SubscribeStrategy(uint256 strategyId_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 stratogyId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| stratogyId | uint256 | undefined |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | undefined |
| amount_ | uint256 | undefined |



## Events

### DCAExecutorChanged

```solidity
event DCAExecutorChanged(address newAddress_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_  | address | undefined |

### StrategyExecuted

```solidity
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | the id fo the executed strategy |
| amountIn_ `indexed` | uint256 | amount received from the swap |

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



