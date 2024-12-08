# DCAReinvestLogic





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*    Decentralised Cost Average Contracts************************************************                  V0.6  ation.capital  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### ACTIVE_REINVESTS

```solidity
function ACTIVE_REINVESTS() external view returns (bytes)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

### REINVEST_VERSION

```solidity
function REINVEST_VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

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




