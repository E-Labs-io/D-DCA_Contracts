# IAToken

*Aave*

> IAToken

Defines the basic interface for an AToken.



## Methods

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

Get the domain separator for the token

*Return cached value if chainId matches cache, otherwise recomputes separator*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | The domain separator of the token at current chain |

### RESERVE_TREASURY_ADDRESS

```solidity
function RESERVE_TREASURY_ADDRESS() external view returns (address)
```

Returns the address of the Aave treasury, receiving the fees on this aToken.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | Address of the Aave treasury |

### UNDERLYING_ASSET_ADDRESS

```solidity
function UNDERLYING_ASSET_ADDRESS() external view returns (address)
```

Returns the address of the underlying asset of this aToken (E.g. WETH for aWETH)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address of the underlying asset |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```



*Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| spender | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### approve

```solidity
function approve(address spender, uint256 value) external nonpayable returns (bool)
```



*Sets a `value` amount of tokens as the allowance of `spender` over the caller&#39;s tokens. Returns a boolean value indicating whether the operation succeeded. IMPORTANT: Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender&#39;s allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729 Emits an {Approval} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | undefined |
| value | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```



*Returns the value of tokens owned by `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### burn

```solidity
function burn(address from, address receiverOfUnderlying, uint256 amount, uint256 index) external nonpayable
```

Burns aTokens from `user` and sends the equivalent amount of underlying to `receiverOfUnderlying`

*In some instances, the mint event could be emitted from a burn transaction if the amount to burn is less than the interest that the user accrued*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | The address from which the aTokens will be burned |
| receiverOfUnderlying | address | The address that will receive the underlying |
| amount | uint256 | The amount being burned |
| index | uint256 | The next liquidity index of the reserve |

### handleRepayment

```solidity
function handleRepayment(address user, address onBehalfOf, uint256 amount) external nonpayable
```

Handles the underlying received by the aToken after the transfer has been completed.

*The default implementation is empty as with standard ERC20 tokens, nothing needs to be done after the transfer is concluded. However in the future there may be aTokens that allow for example to stake the underlying to receive LM rewards. In that case, `handleRepayment()` would perform the staking of the underlying asset.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | The user executing the repayment |
| onBehalfOf | address | The address of the user who will get his debt reduced/removed |
| amount | uint256 | The amount getting repaid |

### mint

```solidity
function mint(address caller, address onBehalfOf, uint256 amount, uint256 index) external nonpayable returns (bool)
```

Mints `amount` aTokens to `user`



#### Parameters

| Name | Type | Description |
|---|---|---|
| caller | address | The address performing the mint |
| onBehalfOf | address | The address of the user that will receive the minted aTokens |
| amount | uint256 | The amount of tokens getting minted |
| index | uint256 | The next liquidity index of the reserve |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | `true` if the the previous balance of the user was 0 |

### mintToTreasury

```solidity
function mintToTreasury(uint256 amount, uint256 index) external nonpayable
```

Mints aTokens to the reserve treasury



#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | The amount of tokens getting minted |
| index | uint256 | The next liquidity index of the reserve |

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```

Returns the nonce for owner.



#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The address of the owner |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | The nonce of the owner |

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

Allow passing a signed message to approve spending

*implements the permit function as for https://github.com/ethereum/EIPs/blob/8a34d644aacf0f9f8f00815307fd7dd5da07655f/EIPS/eip-2612.md*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | The owner of the funds |
| spender | address | The spender |
| value | uint256 | The amount |
| deadline | uint256 | The deadline timestamp, type(uint256).max for max deadline |
| v | uint8 | Signature param |
| r | bytes32 | Signature param |
| s | bytes32 | Signature param |

### rescueTokens

```solidity
function rescueTokens(address token, address to, uint256 amount) external nonpayable
```

Rescue and transfer tokens locked in this contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | The address of the token |
| to | address | The address of the recipient |
| amount | uint256 | The amount of token to transfer |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*Returns the value of tokens in existence.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address to, uint256 value) external nonpayable returns (bool)
```



*Moves a `value` amount of tokens from the caller&#39;s account to `to`. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| value | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external nonpayable returns (bool)
```



*Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism. `value` is then deducted from the caller&#39;s allowance. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| value | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### transferOnLiquidation

```solidity
function transferOnLiquidation(address from, address to, uint256 value) external nonpayable
```

Transfers aTokens in the event of a borrow being liquidated, in case the liquidators reclaims the aToken



#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | The address getting liquidated, current owner of the aTokens |
| to | address | The recipient |
| value | uint256 | The amount of tokens getting transferred |

### transferUnderlyingTo

```solidity
function transferUnderlyingTo(address target, uint256 amount) external nonpayable
```

Transfers the underlying asset to `target`.

*Used by the Pool to transfer assets in borrow(), withdraw() and flashLoan()*

#### Parameters

| Name | Type | Description |
|---|---|---|
| target | address | The recipient of the underlying |
| amount | uint256 | The amount getting transferred |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```



*Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| spender `indexed` | address | undefined |
| value  | uint256 | undefined |

### BalanceTransfer

```solidity
event BalanceTransfer(address indexed from, address indexed to, uint256 value, uint256 index)
```



*Emitted during the transfer action*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | The user whose tokens are being transferred |
| to `indexed` | address | The recipient |
| value  | uint256 | The scaled amount being transferred |
| index  | uint256 | The next liquidity index of the reserve |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```



*Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| value  | uint256 | undefined |



