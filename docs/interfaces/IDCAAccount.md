# IDCAAccount









## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable returns (bool)
```

Triggered by the assigned executor to execute the given strategy



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} Id for the Strategy to be executed |
| feeAmount_ | uint16 | (uint16) amount of the strategy amount to be paid via fee (percent) |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | If the function was successful |

### ExecutorDeactivateStrategy

```solidity
function ExecutorDeactivateStrategy(uint256 strategyId_) external nonpayable
```

Ony callable by the DCAExecutor contract to remove the strategy from the executor

*used when a strategy runs out of funds to execute*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} Id of the strategy to remove |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```

Allows the account owner to fund the account for strategy&#39;s

*the funds are not strategy specificMust approve the spend before calling this function*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Address for the base token being funded |
| amount_ | uint256 | {uint256} Amount of the token to be deposited |

### SetupStrategy

```solidity
function SetupStrategy(IDCADataStructures.Strategy newStrategy_, uint256 seedFunds_, bool subscribeToExecutor_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newStrategy_ | IDCADataStructures.Strategy | undefined |
| seedFunds_ | uint256 | undefined |
| subscribeToExecutor_ | bool | undefined |

### SubscribeStrategy

```solidity
function SubscribeStrategy(uint256 strategyId_) external nonpayable
```

Used by the account owner to subscribe the strategy to the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} The Id of the strategy to subscribe to the executor |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```

Removes a given amount from the Address of the given base token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Address of the base token to remove from the contract |
| amount_ | uint256 | {uint256} Amount of the base token to remove from the address |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```

Used by the account owner to unsubscribe the strategy to the executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} ID of the strategy to unsubscribe |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```

Removes a given amount from the Address of the given target token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Address of the target token to remove from the account |
| amount_ | uint256 | {uint256} Amount of the target token to remove from the account |

### getBaseBalance

```solidity
function getBaseBalance(address token_) external nonpayable returns (uint256)
```

Gets Account balance of the provided base token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Address for the token to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} Amount of that token in the account |

### getTargetBalance

```solidity
function getTargetBalance(address token_) external nonpayable returns (uint256)
```

Gets Account balance of the provided target token



#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Address for the token to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} Amount of that token in the account |

### getTimeTillWindow

```solidity
function getTimeTillWindow(uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | undefined |
| secondsLeft | uint256 | undefined |
| checkReturn | bool | undefined |

### setStrategyReinvest

```solidity
function setStrategyReinvest(uint256 strategyId_, IDCADataStructures.Reinvest reinvest_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| reinvest_ | IDCADataStructures.Reinvest | undefined |



## Events

### DCAReinvestLibraryChanged

```solidity
event DCAReinvestLibraryChanged(address indexed newLibraryAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | undefined |

### NewStrategyCreated

```solidity
event NewStrategyCreated(uint256 indexed strategyId_)
```

Emitted when a new strategy has been created



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} Id of the newly created strategy |

### StrategyExecuted

```solidity
event StrategyExecuted(uint256 indexed strategyId_, uint256 indexed amountIn_, bool reInvest_)
```

Emitted when a strategy has been executed



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} the id for the executed strategy |
| amountIn_ `indexed` | uint256 | {uint256} amount received from the swap |
| reInvest_  | bool | {bool} wether the strategy reinvested or not |

### StrategyReinvestExecuted

```solidity
event StrategyReinvestExecuted(uint256 indexed strategyId_, bool indexed success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | undefined |
| success `indexed` | bool | undefined |

### StrategyReinvestUnwound

```solidity
event StrategyReinvestUnwound(uint256 indexed strategyId, uint256 amount, bool indexed success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId `indexed` | uint256 | undefined |
| amount  | uint256 | undefined |
| success `indexed` | bool | undefined |

### StrategySubscribed

```solidity
event StrategySubscribed(uint256 indexed strategyId_, address indexed executor_)
```

Emitted when the Strategy is confirmed to be subscribed to an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} ID of the strategy that has been subscribed |
| executor_ `indexed` | address | {address} Address of the Executor contract subscribed to |

### StrategyUnsubscribed

```solidity
event StrategyUnsubscribed(uint256 indexed strategyId_)
```

Emitted when a strategy has been unsubscribed from an Executor



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} Id of the strategy being unsubscribed |



