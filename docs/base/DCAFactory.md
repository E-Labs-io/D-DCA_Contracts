# DCAFactory





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*      Distributed Cost Average Contracts************************************************                  V0.7  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### CreateAccount

```solidity
function CreateAccount() external nonpayable
```

Will create a new DCAAccount with the sender as the initial owner.

*Creates a new DCAAccount*


### SWAP_ROUTER

```solidity
function SWAP_ROUTER() external view returns (address)
```



*The swap router address*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The swap router address |

### accountsCreated

```solidity
function accountsCreated() external view returns (uint256)
```



*The total deployed accounts*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total deployed accounts |

### getAccountsOfUser

```solidity
function getAccountsOfUser(address _user) external view returns (address[])
```



*Gets all DCAAccounts created by a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | The address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | The addresses of the DCAAccounts created by the user |

### getActiveExecutorAddress

```solidity
function getActiveExecutorAddress() external view returns (address)
```



*Gets the executor address*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The executor address |

### getFactoryActiveState

```solidity
function getFactoryActiveState() external view returns (bool)
```



*Gets the active state of the factory*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | The active state of the factory |

### getTotalDeployedAccounts

```solidity
function getTotalDeployedAccounts() external view returns (uint256)
```



*Gets the total deployed accounts*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total deployed accounts |

### isActive

```solidity
function isActive() external view returns (bool)
```

Returns the active state of the contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | isActive True if the contract is active, false otherwise |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### pauseFactory

```solidity
function pauseFactory() external nonpayable
```



*Pauses the factory*


### reInvestLogicContract

```solidity
function reInvestLogicContract() external view returns (address)
```



*The reinvest logic contract address*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The reinvest logic contract address |

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

### unpauseFactory

```solidity
function unpauseFactory() external nonpayable
```



*Unpauses the factory*


### updateExecutorAddress

```solidity
function updateExecutorAddress(address _newExecutorAddress) external nonpayable
```



*Updates the executor address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _newExecutorAddress | address | The address of the new executor |

### updateReinvestLibraryAddress

```solidity
function updateReinvestLibraryAddress(address newAddress_) external nonpayable
```



*Updates the reinvest library address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ | address | The address of the new reinvest library |

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

### AccountCreated

```solidity
event AccountCreated(address indexed owner, address indexed dcaAccount)
```

Emitted when a new DCAAccount is created.



#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | The owner of the DCAAccount |
| dcaAccount `indexed` | address | The address of the DCAAccount |

### ContractActiveStateChange

```solidity
event ContractActiveStateChange(bool indexed active_)
```

Emitted when the active state of the contract is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| active_ `indexed` | bool | The new active state |

### ExecutorChanged

```solidity
event ExecutorChanged(address indexed newAddress)
```

Emitted when the DCAExecutor address is changed.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress `indexed` | address | The new address of the DCAExecutor |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### ReinvestLibraryChanged

```solidity
event ReinvestLibraryChanged(address indexed newLibraryAddress)
```

Emitted when the DCAReinvestContract address is changed.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | The new address of the DCAReinvestContract |



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


