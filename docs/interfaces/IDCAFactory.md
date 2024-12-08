# IDCAFactory





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### CreateAccount

```solidity
function CreateAccount() external nonpayable
```

Creates a new DCAAccount to belong to the caller.Emits a DCAAccountCreated event.

*Access control is handled by the OnlyActive inheritance.*


### getActiveExecutorAddress

```solidity
function getActiveExecutorAddress() external view returns (address)
```

Returns the active address of the DCAExecutor.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address of the active DCAExecutor. |

### getDCAAccountsOfUser

```solidity
function getDCAAccountsOfUser(address _user) external view returns (address[])
```

Returns all DCAAccounts that belong to a user.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | Address of the account creator. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | An array of DCAAccount addresses. |

### getFactoryActiveState

```solidity
function getFactoryActiveState() external view returns (bool)
```

Returns the active state of the factory.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | A boolean indicating whether the factory is active. |

### getTotalDeployedAccounts

```solidity
function getTotalDeployedAccounts() external view returns (uint256)
```

Returns the total number of deployed DCAAccounts.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The total number of deployed DCAAccounts. |

### updateExecutorAddress

```solidity
function updateExecutorAddress(address _newExecutorAddress) external nonpayable
```

Updates the DCAExecutor address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newExecutorAddress | address | The new address of the DCAExecutor. |

### updateReinvestLibraryAddress

```solidity
function updateReinvestLibraryAddress(address newAddress_) external nonpayable
```

Updates the DCAReinvestLibrary address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress_ | address | The new address of the DCAReinvestLibrary. |



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

### ExecutorChanged

```solidity
event ExecutorChanged(address indexed newAddress)
```

Emitted when the DCAExecutor address is changed.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newAddress `indexed` | address | The new address of the DCAExecutor |

### ReinvestLibraryChanged

```solidity
event ReinvestLibraryChanged(address indexed newLibraryAddress)
```

Emitted when the DCAReinvestContract address is changed.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newLibraryAddress `indexed` | address | The new address of the DCAReinvestContract |



