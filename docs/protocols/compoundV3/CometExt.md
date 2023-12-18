# CometExt









## Methods

### allow

```solidity
function allow(address manager, bool isAllowed_) external nonpayable
```

Allow or disallow another address to withdraw, or transfer from the sender



#### Parameters

| Name | Type | Description |
|---|---|---|
| manager | address | The account which will be allowed or disallowed |
| isAllowed_ | bool | Whether to allow or disallow |

### allowBySig

```solidity
function allowBySig(address owner, address manager, bool isAllowed_, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

Sets authorization status for a manager via signature from signatory



#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The address that signed the signature |
| manager | address | The address to authorize (or rescind authorization from) |
| isAllowed_ | bool | Whether to authorize or rescind authorization from manager |
| nonce | uint256 | The next expected nonce value for the signatory |
| expiry | uint256 | Expiration time for the signature |
| v | uint8 | The recovery byte of the signature |
| r | bytes32 | Half of the ECDSA signature pair |
| s | bytes32 | Half of the ECDSA signature pair |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

Get the current allowance from `owner` for `spender`

*Note: this binary allowance is unlike most other ERC20 tokensNote: this allowance allows spender to manage *all* the owner&#39;s assets*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The address of the account which owns the tokens to be spent |
| spender | address | The address of the account which may transfer tokens |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Either uint.max (spender is allowed) or zero (spender is disallowed) |

### approve

```solidity
function approve(address spender, uint256 amount) external nonpayable returns (bool)
```

Approve or disallow `spender` to transfer on sender&#39;s behalf

*Note: this binary approval is unlike most other ERC20 tokensNote: this grants full approval for spender to manage *all* the owner&#39;s assets*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | The address of the account which may transfer tokens |
| amount | uint256 | Either uint.max (to allow) or zero (to disallow) |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Whether or not the approval change succeeded |

### baseAccrualScale

```solidity
function baseAccrualScale() external pure returns (uint64)
```

External getters for internal constants *




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### baseIndexScale

```solidity
function baseIndexScale() external pure returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### baseTrackingAccrued

```solidity
function baseTrackingAccrued(address account) external view returns (uint64)
```

Query the total accrued base rewards for an account



#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The account to query |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | The accrued rewards, scaled by `BASE_ACCRUAL_SCALE` |

### collateralBalanceOf

```solidity
function collateralBalanceOf(address account, address asset) external view returns (uint128)
```

Query the current collateral balance of an account



#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The account whose balance to query |
| asset | address | The collateral asset to check the balance for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint128 | The collateral balance of the account |

### factorScale

```solidity
function factorScale() external pure returns (uint64)
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
function maxAssets() external pure returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### name

```solidity
function name() external view returns (string)
```

Get the ERC20 name for wrapped base token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The name as a string |

### priceScale

```solidity
function priceScale() external pure returns (uint64)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```

Get the ERC20 symbol for wrapped base token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | The symbol as a string |

### totalsBasic

```solidity
function totalsBasic() external view returns (struct CometStorage.TotalsBasic)
```

Aggregate variables tracked for the entire market*




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

The major version of this contract




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







