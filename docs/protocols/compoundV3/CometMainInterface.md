# CometMainInterface

*Compound*

> Compound&#39;s Comet Main Interface (without Ext)

An efficient monolithic money market protocol



## Methods

### absorb

```solidity
function absorb(address absorber, address[] accounts) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| absorber | address | undefined |
| accounts | address[] | undefined |

### accrueAccount

```solidity
function accrueAccount(address account) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

### approveThis

```solidity
function approveThis(address manager, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| manager | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### baseBorrowMin

```solidity
function baseBorrowMin() external view returns (uint256)
```



*uint104*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### baseMinForRewards

```solidity
function baseMinForRewards() external view returns (uint256)
```



*uint104*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### baseScale

```solidity
function baseScale() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### baseToken

```solidity
function baseToken() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### baseTokenPriceFeed

```solidity
function baseTokenPriceFeed() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### baseTrackingBorrowSpeed

```solidity
function baseTrackingBorrowSpeed() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### baseTrackingSupplySpeed

```solidity
function baseTrackingSupplySpeed() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### borrowBalanceOf

```solidity
function borrowBalanceOf(address account) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### borrowKink

```solidity
function borrowKink() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### borrowPerSecondInterestRateBase

```solidity
function borrowPerSecondInterestRateBase() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### borrowPerSecondInterestRateSlopeHigh

```solidity
function borrowPerSecondInterestRateSlopeHigh() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### borrowPerSecondInterestRateSlopeLow

```solidity
function borrowPerSecondInterestRateSlopeLow() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### buyCollateral

```solidity
function buyCollateral(address asset, uint256 minAmount, uint256 baseAmount, address recipient) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |
| minAmount | uint256 | undefined |
| baseAmount | uint256 | undefined |
| recipient | address | undefined |

### decimals

```solidity
function decimals() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### extensionDelegate

```solidity
function extensionDelegate() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getAssetInfo

```solidity
function getAssetInfo(uint8 i) external view returns (struct CometCore.AssetInfo)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| i | uint8 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | CometCore.AssetInfo | undefined |

### getAssetInfoByAddress

```solidity
function getAssetInfoByAddress(address asset) external view returns (struct CometCore.AssetInfo)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | CometCore.AssetInfo | undefined |

### getBorrowRate

```solidity
function getBorrowRate(uint256 utilization) external view returns (uint64)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| utilization | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### getCollateralReserves

```solidity
function getCollateralReserves(address asset) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getPrice

```solidity
function getPrice(address priceFeed) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| priceFeed | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getReserves

```solidity
function getReserves() external view returns (int256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### getSupplyRate

```solidity
function getSupplyRate(uint256 utilization) external view returns (uint64)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| utilization | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint64 | undefined |

### getUtilization

```solidity
function getUtilization() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### governor

```solidity
function governor() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### initializeStorage

```solidity
function initializeStorage() external nonpayable
```






### isAbsorbPaused

```solidity
function isAbsorbPaused() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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

### isBorrowCollateralized

```solidity
function isBorrowCollateralized(address account) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isBuyPaused

```solidity
function isBuyPaused() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isLiquidatable

```solidity
function isLiquidatable(address account) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isSupplyPaused

```solidity
function isSupplyPaused() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isTransferPaused

```solidity
function isTransferPaused() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isWithdrawPaused

```solidity
function isWithdrawPaused() external view returns (bool)
```






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

### numAssets

```solidity
function numAssets() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### pause

```solidity
function pause(bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| supplyPaused | bool | undefined |
| transferPaused | bool | undefined |
| withdrawPaused | bool | undefined |
| absorbPaused | bool | undefined |
| buyPaused | bool | undefined |

### pauseGuardian

```solidity
function pauseGuardian() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### quoteCollateral

```solidity
function quoteCollateral(address asset, uint256 baseAmount) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |
| baseAmount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### storeFrontPriceFactor

```solidity
function storeFrontPriceFactor() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supply

```solidity
function supply(address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |
| amount | uint256 | undefined |

### supplyFrom

```solidity
function supplyFrom(address from, address dst, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| dst | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### supplyKink

```solidity
function supplyKink() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supplyPerSecondInterestRateBase

```solidity
function supplyPerSecondInterestRateBase() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supplyPerSecondInterestRateSlopeHigh

```solidity
function supplyPerSecondInterestRateSlopeHigh() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supplyPerSecondInterestRateSlopeLow

```solidity
function supplyPerSecondInterestRateSlopeLow() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### supplyTo

```solidity
function supplyTo(address dst, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| dst | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### targetReserves

```solidity
function targetReserves() external view returns (uint256)
```



*uint104*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalBorrow

```solidity
function totalBorrow() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### trackingIndexScale

```solidity
function trackingIndexScale() external view returns (uint256)
```



*uint64*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address dst, uint256 amount) external nonpayable returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| dst | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### transferAsset

```solidity
function transferAsset(address dst, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| dst | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### transferAssetFrom

```solidity
function transferAssetFrom(address src, address dst, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src | address | undefined |
| dst | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### transferFrom

```solidity
function transferFrom(address src, address dst, uint256 amount) external nonpayable returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src | address | undefined |
| dst | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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

### withdraw

```solidity
function withdraw(address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| asset | address | undefined |
| amount | uint256 | undefined |

### withdrawFrom

```solidity
function withdrawFrom(address src, address to, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src | address | undefined |
| to | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |

### withdrawReserves

```solidity
function withdrawReserves(address to, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| amount | uint256 | undefined |

### withdrawTo

```solidity
function withdrawTo(address to, address asset, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| asset | address | undefined |
| amount | uint256 | undefined |



## Events

### AbsorbCollateral

```solidity
event AbsorbCollateral(address indexed absorber, address indexed borrower, address indexed asset, uint256 collateralAbsorbed, uint256 usdValue)
```

Event emitted when a user&#39;s collateral is absorbed by the protocol



#### Parameters

| Name | Type | Description |
|---|---|---|
| absorber `indexed` | address | undefined |
| borrower `indexed` | address | undefined |
| asset `indexed` | address | undefined |
| collateralAbsorbed  | uint256 | undefined |
| usdValue  | uint256 | undefined |

### AbsorbDebt

```solidity
event AbsorbDebt(address indexed absorber, address indexed borrower, uint256 basePaidOut, uint256 usdValue)
```

Event emitted when a borrow position is absorbed by the protocol



#### Parameters

| Name | Type | Description |
|---|---|---|
| absorber `indexed` | address | undefined |
| borrower `indexed` | address | undefined |
| basePaidOut  | uint256 | undefined |
| usdValue  | uint256 | undefined |

### BuyCollateral

```solidity
event BuyCollateral(address indexed buyer, address indexed asset, uint256 baseAmount, uint256 collateralAmount)
```

Event emitted when a collateral asset is purchased from the protocol



#### Parameters

| Name | Type | Description |
|---|---|---|
| buyer `indexed` | address | undefined |
| asset `indexed` | address | undefined |
| baseAmount  | uint256 | undefined |
| collateralAmount  | uint256 | undefined |

### PauseAction

```solidity
event PauseAction(bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused)
```

Event emitted when an action is paused/unpaused



#### Parameters

| Name | Type | Description |
|---|---|---|
| supplyPaused  | bool | undefined |
| transferPaused  | bool | undefined |
| withdrawPaused  | bool | undefined |
| absorbPaused  | bool | undefined |
| buyPaused  | bool | undefined |

### Supply

```solidity
event Supply(address indexed from, address indexed dst, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| dst `indexed` | address | undefined |
| amount  | uint256 | undefined |

### SupplyCollateral

```solidity
event SupplyCollateral(address indexed from, address indexed dst, address indexed asset, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| dst `indexed` | address | undefined |
| asset `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |

### TransferCollateral

```solidity
event TransferCollateral(address indexed from, address indexed to, address indexed asset, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| asset `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Withdraw

```solidity
event Withdraw(address indexed src, address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src `indexed` | address | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |

### WithdrawCollateral

```solidity
event WithdrawCollateral(address indexed src, address indexed to, address indexed asset, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src `indexed` | address | undefined |
| to `indexed` | address | undefined |
| asset `indexed` | address | undefined |
| amount  | uint256 | undefined |

### WithdrawReserves

```solidity
event WithdrawReserves(address indexed to, uint256 amount)
```

Event emitted when reserves are withdrawn by the governor



#### Parameters

| Name | Type | Description |
|---|---|---|
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |



## Errors

### Absurd

```solidity
error Absurd()
```






### AlreadyInitialized

```solidity
error AlreadyInitialized()
```






### BadAsset

```solidity
error BadAsset()
```






### BadDecimals

```solidity
error BadDecimals()
```






### BadDiscount

```solidity
error BadDiscount()
```






### BadMinimum

```solidity
error BadMinimum()
```






### BadPrice

```solidity
error BadPrice()
```






### BorrowCFTooLarge

```solidity
error BorrowCFTooLarge()
```






### BorrowTooSmall

```solidity
error BorrowTooSmall()
```






### InsufficientReserves

```solidity
error InsufficientReserves()
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




### LiquidateCFTooLarge

```solidity
error LiquidateCFTooLarge()
```






### NegativeNumber

```solidity
error NegativeNumber()
```






### NoSelfTransfer

```solidity
error NoSelfTransfer()
```






### NotCollateralized

```solidity
error NotCollateralized()
```






### NotForSale

```solidity
error NotForSale()
```






### NotLiquidatable

```solidity
error NotLiquidatable()
```






### Paused

```solidity
error Paused()
```






### SupplyCapExceeded

```solidity
error SupplyCapExceeded()
```






### TimestampTooLarge

```solidity
error TimestampTooLarge()
```






### TooManyAssets

```solidity
error TooManyAssets()
```






### TooMuchSlippage

```solidity
error TooMuchSlippage()
```






### TransferInFailed

```solidity
error TransferInFailed()
```






### TransferOutFailed

```solidity
error TransferOutFailed()
```






### Unauthorized

```solidity
error Unauthorized()
```







