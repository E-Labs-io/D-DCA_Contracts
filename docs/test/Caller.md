# Caller









## Methods

### call

```solidity
function call() external nonpayable returns (uint256 amount, bool success)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |

### calledContract

```solidity
function calledContract() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### updateCalledAddress

```solidity
function updateCalledAddress(address newAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ | address | undefined |



## Events

### ChangedCalledAddress

```solidity
event ChangedCalledAddress(address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0  | address | undefined |

### CompleteCall

```solidity
event CompleteCall(uint256 number, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| number  | uint256 | undefined |
| success  | bool | undefined |

### ReturnedData

```solidity
event ReturnedData(bytes returnData, bool txSuccess)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| returnData  | bytes | undefined |
| txSuccess  | bool | undefined |



