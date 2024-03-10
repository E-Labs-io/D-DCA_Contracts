# DCAReinvest









## Methods

### ACTIVE_REINVESTS

```solidity
function ACTIVE_REINVESTS() external view returns (bytes)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

### REINVEST_ACTIVE

```solidity
function REINVEST_ACTIVE() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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
function executeReinvest(DCAReinvestLogic.Reinvest reinvestData_, uint256 amount_) external nonpayable returns (uint256 amount, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| reinvestData_ | DCAReinvestLogic.Reinvest | undefined |
| amount_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |

### getLibraryVersion

```solidity
function getLibraryVersion() external pure returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### migrateReinvest

```solidity
function migrateReinvest(DCAReinvestLogic.Reinvest oldReinvestData_, DCAReinvestLogic.Reinvest newReinvestData_, bool withdrawFunds_) external nonpayable returns (uint256 amount, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| oldReinvestData_ | DCAReinvestLogic.Reinvest | undefined |
| newReinvestData_ | DCAReinvestLogic.Reinvest | undefined |
| withdrawFunds_ | bool | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |

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






### testCall

```solidity
function testCall() external nonpayable returns (uint256, bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |
| _1 | bool | undefined |

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
function unwindReinvest(DCAReinvestLogic.Reinvest reinvestData_, uint256 amount_) external nonpayable returns (uint256 amount, bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| reinvestData_ | DCAReinvestLogic.Reinvest | undefined |
| amount_ | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | undefined |
| success | bool | undefined |



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### TestCall

```solidity
event TestCall()
```








## Errors

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


