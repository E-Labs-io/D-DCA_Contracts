# DCAFactory









## Methods

### createDCAAccount

```solidity
function createDCAAccount() external nonpayable
```






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

### getFactoryPauseState

```solidity
function getFactoryPauseState() external view returns (bool)
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


### setActiveState

```solidity
function setActiveState(bool newState_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| newState_ | bool | undefined |

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


