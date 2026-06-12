# SwapTest







*Test harness for the Swap mixin. TEST CONTRACT ONLY — never      deployed to production networks. V0.9 changes:  - _swap now takes an absolute minAmountOut instead of slippage bps;    every external helper exposes that parameter so tests drive it.  - receive()/fallback() no longer console.log: WETH9.withdraw sends    ETH with the 2300-gas stipend, and console.log costs more than    that — the logging itself made every ETH-receiving test revert.  - quoteSwap exposes _getQuote so tests can derive a sane floor.*

## Methods

### DEFAULT_POOL_FEE

```solidity
function DEFAULT_POOL_FEE() external view returns (uint24)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint24 | undefined |

### QUOTER

```solidity
function QUOTER() external view returns (contract IQuoterV2)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IQuoterV2 | undefined |

### SWAP_ROUTER

```solidity
function SWAP_ROUTER() external view returns (contract ISwapRouter)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ISwapRouter | undefined |

### quoteSwap

```solidity
function quoteSwap(address tokenIn, address tokenOut, uint256 amountIn) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenIn | address | undefined |
| tokenOut | address | undefined |
| amountIn | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### setAllowance

```solidity
function setAllowance(address tokenAddress, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | undefined |
| amount | uint256 | undefined |

### swapToEthInContract

```solidity
function swapToEthInContract(address baseTokenAddress, uint256 amount, uint256 minAmountOut) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| amount | uint256 | undefined |
| minAmountOut | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### swapTokensInContract

```solidity
function swapTokensInContract(address baseTokenAddress, address targetTokenAddress, uint256 amount, uint256 minAmountOut) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| targetTokenAddress | address | undefined |
| amount | uint256 | undefined |
| minAmountOut | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### swapTokensToEthToTarget

```solidity
function swapTokensToEthToTarget(address baseTokenAddress, uint256 amount, address recipient, uint256 minAmountOut) external nonpayable returns (uint256 amountReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| amount | uint256 | undefined |
| recipient | address | undefined |
| minAmountOut | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountReturned | uint256 | undefined |

### swapTokensToTarget

```solidity
function swapTokensToTarget(address baseTokenAddress, address targetTokenAddress, uint256 amount, address recipient, uint256 minAmountOut) external nonpayable returns (uint256 amountReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| targetTokenAddress | address | undefined |
| amount | uint256 | undefined |
| recipient | address | undefined |
| minAmountOut | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountReturned | uint256 | undefined |

### withdrawETH

```solidity
function withdrawETH(uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |




## Errors

### NoMinimumOut

```solidity
error NoMinimumOut()
```

Thrown when a swap is attempted without an explicit         minimum-output floor. A zero floor means unlimited         slippage — never acceptable for user funds.




### QuoteFailed

```solidity
error QuoteFailed(address tokenIn, address tokenOut, uint256 amountIn)
```

Thrown when an on-chain quote cannot be obtained.



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenIn | address | undefined |
| tokenOut | address | undefined |
| amountIn | uint256 | undefined |


