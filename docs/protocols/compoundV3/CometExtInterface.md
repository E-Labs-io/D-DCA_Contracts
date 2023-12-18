# CometExtInterface

*Compound*

> Compound&#39;s Comet Ext Interface

An efficient monolithic money market protocol



## Methods

### allow

```solidity
function allow(address manager, bool isAllowed) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| manager | address | undefined |
| isAllowed | bool | undefined |

### allowBySig

```solidity
function allowBySig(address owner, address manager, bool isAllowed, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| manager | address | undefined |
| isAllowed | bool | undefined |
| nonce | uint256 | undefined |
| expiry | uint256 | undefined |
| v | uint8 | undefined |
| r | bytes32 | undefined |
| s | bytes32 | undefined |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

Get the current allowance from `owner` for `spender`



#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The address of the account which owns the tokens to be spent |
| spender | address | The address of the account which may transfer tokens |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The number of tokens allowed to be spent (-1 means infinite) |

### approve

```solidity
function approve(address spender, uint256 amount) external nonpayable returns (bool)
```

Approve `spender` to transfer up to `amount` from `src`

*This will overwrite the approval amount for `spender`  and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | The address of the account which may transfer tokens |
| amount | uint256 | The number of tokens that are approved (-1 means infinite) |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Whether or not the approval succeeded |

### baseAccrualScale

```solidity
function baseAccrualScale() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### baseIndexScale

```solidity
function baseIndexScale() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### baseTrackingAccrued

```solidity
function baseTrackingAccrued(address account) external view returns (uint64)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### collateralBalanceOf

```solidity
function collateralBalanceOf(address account, address asset) external view returns (uint128)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |
| asset | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint128 | undefined |

### factorScale

```solidity
function factorScale() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### hasPermission

```solidity
function hasPermission(address owner, address manager) external view returns (bool)
```

Determine if the manager has permission to act on behalf of the owner



#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The owner account |
| manager | address | The manager account |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Whether or not the manager has permission |

### isAllowed

```solidity
function isAllowed(address, address) external view returns (bool)
```

Mapping of users to accounts which may be permitted to manage the user account



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### liquidatorPoints

```solidity
function liquidatorPoints(address) external view returns (uint32 numAbsorbs, uint64 numAbsorbed, uint128 approxSpend, uint32 _reserved)
```

Mapping of magic liquidator points



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| numAbsorbs | uint32 | undefined |
| numAbsorbed | uint64 | undefined |
| approxSpend | uint128 | undefined |
| _reserved | uint32 | undefined |

### maxAssets

```solidity
function maxAssets() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### name

```solidity
function name() external view returns (string)
```

===== ERC20 interfaces ===== Does not include the following functions/events, which are defined in `CometMainInterface` instead: - function decimals() virtual external view returns (uint8) - function totalSupply() virtual external view returns (uint256) - function transfer(address dst, uint amount) virtual external returns (bool) - function transferFrom(address src, address dst, uint amount) virtual external returns (bool) - function balanceOf(address owner) virtual external view returns (uint256) - event Transfer(address indexed from, address indexed to, uint256 amount)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### priceScale

```solidity
function priceScale() external view returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalsBasic

```solidity
function totalsBasic() external view returns (struct CometStorage.TotalsBasic)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | CometStorage.TotalsBasic | undefined |

### totalsCollateral

```solidity
function totalsCollateral(address) external view returns (uint128 totalSupplyAsset, uint128 _reserved)
```

Aggregate variables tracked for each collateral asset



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| totalSupplyAsset | uint128 | undefined |
| _reserved | uint128 | undefined |

### userBasic

```solidity
function userBasic(address) external view returns (int104 principal, uint64 baseTrackingIndex, uint64 baseTrackingAccrued, uint16 assetsIn, uint8 _reserved)
```

Mapping of users to base principal and other basic data



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| principal | int104 | undefined |
| baseTrackingIndex | uint64 | undefined |
| baseTrackingAccrued | uint64 | undefined |
| assetsIn | uint16 | undefined |
| _reserved | uint8 | undefined |

### userCollateral

```solidity
function userCollateral(address, address) external view returns (uint128 balance, uint128 _reserved)
```

Mapping of users to collateral data per collateral asset



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| balance | uint128 | undefined |
| _reserved | uint128 | undefined |

### userNonce

```solidity
function userNonce(address) external view returns (uint256)
```

The next expected nonce for an address, for validating authorizations via signature



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### version

```solidity
function version() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| spender `indexed` | address | undefined |
| amount  | uint256 | undefined |



## Errors

### BadAmount

```solidity
error BadAmount()
```






### BadNonce

```solidity
error BadNonce()
```






### BadSignatory

```solidity
error BadSignatory()
```






### InvalidInt104

```solidity
error InvalidInt104()
```






### InvalidInt256

```solidity
error InvalidInt256()
```






### InvalidUInt104

```solidity
error InvalidUInt104()
```






### InvalidUInt128

```solidity
error InvalidUInt128()
```






### InvalidUInt64

```solidity
error InvalidUInt64()
```

Custom errors *




### InvalidValueS

```solidity
error InvalidValueS()
```






### InvalidValueV

```solidity
error InvalidValueV()
```






### NegativeNumber

```solidity
error NegativeNumber()
```






### SignatureExpired

```solidity
error SignatureExpired()
```







