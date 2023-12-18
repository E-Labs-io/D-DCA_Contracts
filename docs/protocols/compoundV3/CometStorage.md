# CometStorage

*Compound*

> Compound&#39;s Comet Storage Interface



*Versions can enforce append-only storage slots via inheritance.*

## Methods

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




