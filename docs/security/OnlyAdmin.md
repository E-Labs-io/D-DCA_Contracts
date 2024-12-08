# OnlyAdmin





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### addAdmin

```solidity
function addAdmin(address newAdmin_) external nonpayable
```

Adds an admin to the contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAdmin_ | address | The address to add as an admin |

### checkIfAdmin

```solidity
function checkIfAdmin(address addressToCheck_) external view returns (bool)
```

Checks if an address is an admin



#### Parameters

| Name | Type | Description |
|---|---|---|
| addressToCheck_ | address | The address to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the address is an admin, false otherwise |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### removeAdmin

```solidity
function removeAdmin(address oldAdmin_) external nonpayable
```

Removes an admin from the contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| oldAdmin_ | address | The address to remove as an admin |

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


