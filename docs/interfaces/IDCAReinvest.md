# IDCAReinvest









## Methods

### executeReinvest

```solidity
function executeReinvest(IDCADataStructures.Reinvest reinvestData_, uint256 amount_) external nonpayable returns (uint256 amount, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| reinvestData_ | IDCADataStructures.Reinvest | undefined |
| amount_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |

### getActiveModuals

```solidity
function getActiveModuals() external view returns (uint8[])
```



*Returns the active moduals*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8[] | The active moduals |

### getLibraryVersion

```solidity
function getLibraryVersion() external view returns (string)
```



*Returns the version of the reinvestment*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The version of the reinvestment |

### isActive

```solidity
function isActive() external view returns (bool)
```



*Checks if the reinvestment is active*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | isActive Whether the reinvestment is active |

### unwindReinvest

```solidity
function unwindReinvest(IDCADataStructures.Reinvest reinvestData_, uint256 amount_) external nonpayable returns (uint256 amount, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| reinvestData_ | IDCADataStructures.Reinvest | undefined |
| amount_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |




