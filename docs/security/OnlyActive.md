# OnlyActive





************************************************ ____ooo____oooooooo_oooo____oooo____ooo____oo_* __oo___oo_____oo_____oo___oo____oo__oooo___oo_* _oo_____oo____oo_____oo__oo______oo_oo_oo__oo_* _ooooooooo____oo_____oo__oo______oo_oo__oo_oo_* _oo_____oo____oo_____oo___oo____oo__oo___oooo_* _oo_____oo____oo____oooo____oooo____oo____ooo_* ______________________________________________*       Dollar Cost Average Contracts************************************************                  V0.6  x.com/0xAtion  x.com/e_labs_  e-labs.co.uk



## Methods

### isActive

```solidity
function isActive() external view returns (bool)
```

Returns the active state of the contract




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | isActive True if the contract is active, false otherwise |



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



## Errors

### ContractIsPaused

```solidity
error ContractIsPaused()
```

Error thrown when the contract is paused





