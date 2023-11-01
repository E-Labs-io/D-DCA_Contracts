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

### GetBaseBalance

```solidity
function GetBaseBalance(contract IERC20 token_) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### GetTargetBalance

```solidity
function GetTargetBalance(contract IERC20 token_) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |

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
function UnFundAccount(contract IERC20 token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |
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
function WithdrawSavings(contract IERC20 token_, uint256 amount_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | contract IERC20 | undefined |
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
event StratogyExecuted(uint256 indexed strategyId_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |



