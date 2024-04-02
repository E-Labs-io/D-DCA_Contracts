# DCAFactory





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### SWAP_ROUTER

```solidity
function SWAP_ROUTER() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### createDCAAccount

```solidity
function createDCAAccount() external nonpayable
```






### getActiveExecutorAddress

```solidity
function getActiveExecutorAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getDCAAccountsOfUser

```solidity
function getDCAAccountsOfUser(address user) external view returns (address[])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | undefined |

### getFactoryActiveState

```solidity
function getFactoryActiveState() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isActive

```solidity
function isActive() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### reInvestLogicContract

```solidity
function reInvestLogicContract() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateExecutorAddress

```solidity
function updateExecutorAddress(address _newExecutorAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _newExecutorAddress | address | undefined |

### updateReinvestLibraryAddress

```solidity
function updateReinvestLibraryAddress(address newAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ | address | undefined |

### userDCAAccounts

```solidity
function userDCAAccounts(address, uint256) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### ContractActiveStateChange

```solidity
event ContractActiveStateChange(bool indexed newState_)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newState_ `indexed` | bool | undefined |

### DCAAccountCreated

```solidity
event DCAAccountCreated(address indexed owner, address indexed dcaAccount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| dcaAccount `indexed` | address | undefined |

### DCAExecutorAddressChanged

```solidity
event DCAExecutorAddressChanged(address indexed newAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress `indexed` | address | undefined |

### DCAReinvestContractAddressChanged

```solidity
event DCAReinvestContractAddressChanged(address indexed newLibraryAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | undefined |

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


