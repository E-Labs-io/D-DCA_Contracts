# IQuoterV2



> QuoterV2 Interface

Supports quoting the calculated amounts from exact input or exact output swaps.

*These functions are not marked view because they rely on calling non-view functions and reverting to compute the result. They are also not gas efficient and should not be called on-chain.*

## Methods

### quoteExactInput

```solidity
function quoteExactInput(bytes path, uint256 amountIn) external nonpayable returns (uint256 amountOut, uint160[] sqrtPriceX96AfterList, uint32[] initializedTicksCrossedList, uint256 gasEstimate)
```

Returns the amount out received for a given exact input swap without executing the swap



#### Parameters

| Name | Type | Description |
|---|---|---|
| path | bytes | The path of the swap, i.e. each token pair and the pool fee |
| amountIn | uint256 | The amount of the first token to swap |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOut | uint256 | The amount of the last token that would be received |
| sqrtPriceX96AfterList | uint160[] | List of the sqrt price after the swap for each pool in the path |
| initializedTicksCrossedList | uint32[] | List of whether each pool in the path has initialized ticks crossed |
| gasEstimate | uint256 | The estimate of the gas that the swap consumes |

### quoteExactOutput

```solidity
function quoteExactOutput(bytes path, uint256 amountOut) external nonpayable returns (uint256 amountIn, uint160[] sqrtPriceX96AfterList, uint32[] initializedTicksCrossedList, uint256 gasEstimate)
```

Returns the amount in required for a given exact output swap without executing the swap



#### Parameters

| Name | Type | Description |
|---|---|---|
| path | bytes | The path of the swap, i.e. each token pair and the pool fee |
| amountOut | uint256 | The amount of the last token to receive |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountIn | uint256 | The amount of first token required to be paid |
| sqrtPriceX96AfterList | uint160[] | List of the sqrt price after the swap for each pool in the path |
| initializedTicksCrossedList | uint32[] | List of whether each pool in the path has initialized ticks crossed |
| gasEstimate | uint256 | The estimate of the gas that the swap consumes |




