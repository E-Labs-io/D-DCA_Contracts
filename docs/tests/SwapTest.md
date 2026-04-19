# SwapTest









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
function swapToEthInContract(address baseTokenAddress, uint256 amount) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### swapTokensInContract

```solidity
function swapTokensInContract(address baseTokenAddress, address targetTokenAddress, uint256 amount) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| targetTokenAddress | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### swapTokensToEthToTarget

```solidity
function swapTokensToEthToTarget(address baseTokenAddress, uint256 amount, address recipient) external nonpayable returns (uint256 amountReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| amount | uint256 | undefined |
| recipient | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amountReturned | uint256 | undefined |

### swapTokensToTarget

```solidity
function swapTokensToTarget(address baseTokenAddress, address targetTokenAddress, uint256 amount, address recipient) external nonpayable returns (uint256 amountReturned)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| baseTokenAddress | address | undefined |
| targetTokenAddress | address | undefined |
| amount | uint256 | undefined |
| recipient | address | undefined |

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




