# DCAReinvest





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



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
function getLibraryVersion() external pure returns (string)
```



*Returns the version of the reinvest library*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The version of the reinvest library |

### getModuleName

```solidity
function getModuleName(uint8 code_) external pure returns (string)
```



*Returns the module name for the given code*

#### Parameters

| Name | Type | Description |
|---|---|---|
| code_ | uint8 | The code to get the module name for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The module name for the given code |

### isActive

```solidity
function isActive() external view returns (bool)
```



*Returns whether the reinvest library is active*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Whether the reinvest library is active |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### setActiveState

```solidity
function setActiveState() external nonpayable
```



*Sets the active state of the reinvest library*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

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



## Events

### ContractActiveStateChange

```solidity
event ContractActiveStateChange(bool indexed active_)
```

Emitted when the active state of the contract is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| active_ `indexed` | bool | The new active state |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



## Errors

### ContractIsPaused

```solidity
error ContractIsPaused()
```

Error thrown when the contract is paused




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


