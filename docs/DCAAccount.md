# DCAAccount









## Methods

### Execute

```solidity
function Execute(uint256 strategyId_, uint16 feeAmount_) external nonpayable returns (bool)
```



*Executes the given strategy with the given fee amount.      Can only be done by the executor.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | the id of the strategy to execute |
| feeAmount_ | uint16 | the amount of fee to pay to the executor |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### ExecutorDeactivateStrategy

```solidity
function ExecutorDeactivateStrategy(uint256 strategyId_) external nonpayable
```

used by the Executor to removed failing strategies/out of funds strategies.

*Force unsubscribe the strategy from the executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### FundAccount

```solidity
function FundAccount(address token_, uint256 amount_) external nonpayable
```



*Fund the account with a base currency*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to deposit |

### SWAP

```solidity
function SWAP(address baseToken_, address targetToken_, uint256 amount_) external nonpayable
```

ONLY IN CONTRACT FOR DEVELOPMENT, WILL REMOVE ON PUBLIC DEPLOY



#### Parameters

| Name | Type | Description |
|---|---|---|
| baseToken_ | address | address of the basetoken |
| targetToken_ | address | address of the target token |
| amount_ | uint256 | amount of the base token to swap into the target token |

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



*Subscribes an already created strategy to an executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | {uint256} Id of the strategy to subscribe to an executor |

### UPGRADE_INTERFACE_VERSION

```solidity
function UPGRADE_INTERFACE_VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### UnFundAccount

```solidity
function UnFundAccount(address token_, uint256 amount_) external nonpayable
```



*Unfund the account of a base currency*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the token to withdraw |

### UnsubscribeStrategy

```solidity
function UnsubscribeStrategy(uint256 strategyId_) external nonpayable
```



*Unsubscribes the given strategy from its executor*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy to unsubscribe |

### WithdrawSavings

```solidity
function WithdrawSavings(address token_, uint256 amount_) external nonpayable
```



*Withdraws the given amount of the target token balance*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} The ERC20 token address |
| amount_ | uint256 | {uint256} Amount of the target token to withdraw |

### changeExecutor

```solidity
function changeExecutor(address newExecutorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newExecutorAddress_ | address | undefined |

### getBaseBalance

```solidity
function getBaseBalance(address token_) external view returns (uint256)
```



*get account balance of base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} account balance of Base token |

### getBaseTokenCostPerBlock

```solidity
function getBaseTokenCostPerBlock(address token_) external view returns (uint256)
```



*get the total cost per-block for all strategies using the base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} amount of the base token strategies use per block |

### getBaseTokenRemainingBlocks

```solidity
function getBaseTokenRemainingBlocks(address token_) external view returns (uint256)
```



*get amount of blocks remaining for given base token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} amount of blocks left for given base token balance |

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getStrategyData

```solidity
function getStrategyData(uint256 strategyId_) external view returns (struct IDCADataStructures.Strategy)
```



*Get the full data for the given strategy*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy data to get |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IDCADataStructures.Strategy | {Strategy} the given strategy&#39;s full data struct |

### getTargetBalance

```solidity
function getTargetBalance(address token_) external view returns (uint256)
```



*get account balance of target token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token_ | address | {address} Base token address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | {uint256} account balance of Base token |

### getTimeTillWindow

```solidity
function getTimeTillWindow(uint256 strategyId_) external view returns (uint256 lastEx, uint256 secondsLeft, bool checkReturn)
```



*returns UI data for strategy interval timing*

#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | Strategy Id of the strategy data to get |

#### Returns

| Name | Type | Description |
|---|---|---|
| lastEx | uint256 | {uint256} time of last execution (seconds) |
| secondsLeft | uint256 | {uint256} seconds left timm strategy is in window |
| checkReturn | bool | {bool} if the strategy is in the window |

### initialize

```solidity
function initialize(address executorAddress_, address swapRouter_, address owner_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |
| swapRouter_ | address | undefined |
| owner_ | address | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### proxiableUUID

```solidity
function proxiableUUID() external view returns (bytes32)
```



*Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the implementation. It is used to validate the implementation&#39;s compatibility when performing an upgrade. IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### removeExecutor

```solidity
function removeExecutor() external nonpayable
```






### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### setStrategyReinvest

```solidity
function setStrategyReinvest(uint256 strategyId_, DCAReinvest.Reinvest reinvest_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ | uint256 | undefined |
| reinvest_ | DCAReinvest.Reinvest | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateSwapAddress

```solidity
function updateSwapAddress(address swapRouter_) external nonpayable
```



*Updates the Uniswap SwapRouter Address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| swapRouter_ | address | {address} New address for the Uniswap router |

### upgradeToAndCall

```solidity
function upgradeToAndCall(address newImplementation, bytes data) external payable
```



*Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. Calls {_authorizeUpgrade}. Emits an {Upgraded} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newImplementation | address | undefined |
| data | bytes | undefined |



## Events

### DCAExecutorChanged

```solidity
event DCAExecutorChanged(address indexed newAddress_)
```

Emitted when the DCAExecutor contract address is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | {address} Address of the Executor contract |

### Initialized

```solidity
event Initialized(uint64 version)
```



*Triggered when the contract has been initialized or reinitialized.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint64 | undefined |

### NewStrategyCreated

```solidity
event NewStrategyCreated(uint256 indexed strategyId_)
```

Emitted when a new strategy has been created



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId_ `indexed` | uint256 | {uint256} Id of the newly created strategy |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

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

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```



*Emitted when the implementation is upgraded.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| implementation `indexed` | address | undefined |



## Errors

### AddressEmptyCode

```solidity
error AddressEmptyCode(address target)
```



*There&#39;s no code at `target` (it is not a contract).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| target | address | undefined |

### ERC1967InvalidImplementation

```solidity
error ERC1967InvalidImplementation(address implementation)
```



*The `implementation` of the proxy is invalid.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| implementation | address | undefined |

### ERC1967NonPayable

```solidity
error ERC1967NonPayable()
```



*An upgrade function sees `msg.value &gt; 0` that may be lost.*


### FailedInnerCall

```solidity
error FailedInnerCall()
```



*A call to an address target failed. The target may have reverted.*


### InvalidInitialization

```solidity
error InvalidInitialization()
```



*The contract is already initialized.*


### NotInitializing

```solidity
error NotInitializing()
```



*The contract is not initializing.*


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

### UUPSUnauthorizedCallContext

```solidity
error UUPSUnauthorizedCallContext()
```



*The call is from an unauthorized context.*


### UUPSUnsupportedProxiableUUID

```solidity
error UUPSUnsupportedProxiableUUID(bytes32 slot)
```



*The storage `slot` is unsupported as a UUID.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| slot | bytes32 | undefined |


