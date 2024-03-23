# ISwapRouter02



> Router token swapping functionality

Functions for swapping tokens via Uniswap V3



## Methods

### WETH9

```solidity
function WETH9() external pure returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### exactInput

```solidity
function exactInput(ISwapRouter02.ExactInputParams params) external payable returns (uint256 amountOut)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| params | ISwapRouter02.ExactInputParams | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOut | uint256 | undefined |

### exactInputSingle

```solidity
function exactInputSingle(ISwapRouter02.ExactInputSingleParams params) external payable returns (uint256 amountOut)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| params | ISwapRouter02.ExactInputSingleParams | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountOut | uint256 | undefined |

### exactOutput

```solidity
function exactOutput(ISwapRouter02.ExactOutputParams params) external payable returns (uint256 amountIn)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| params | ISwapRouter02.ExactOutputParams | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountIn | uint256 | undefined |

### exactOutputSingle

```solidity
function exactOutputSingle(ISwapRouter02.ExactOutputSingleParams params) external payable returns (uint256 amountIn)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| params | ISwapRouter02.ExactOutputSingleParams | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountIn | uint256 | undefined |




