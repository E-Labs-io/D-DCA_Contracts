# DCAAccountFactory









## Methods

### createDCAAccount

```solidity
function createDCAAccount() external nonpayable
```






### getDCAAccountsOfUser

```solidity
function getDCAAccountsOfUser(address user) external view returns (address[])
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| user | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | undefined |

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

### DCAAccountCreated

```solidity
event DCAAccountCreated(address indexed owner, address dcaAccount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| dcaAccount  | address | undefined |



