# OnlyExecutor





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### changeExecutor

```solidity
function changeExecutor(address executorAddress_) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| executorAddress_ | address | undefined |

### getExecutorAddress

```solidity
function getExecutorAddress() external view returns (address)
```

Returns the executor address




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The executor address |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### removeExecutor

```solidity
function removeExecutor() external nonpayable
```

Removes the executor address




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

### ExecutorAddressChange

```solidity
event ExecutorAddressChange(address indexed newAddress_)
```

Emitted when the executor address is changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ `indexed` | address | The new executor address |

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


