# ReentrancyAttacker







*A malicious contract for testing reentrancy attacks*

## Methods

### attack

```solidity
function attack() external nonpayable
```



*Attempt a reentrancy attack by calling back into the target contract*


### attackInProgress

```solidity
function attackInProgress() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### target

```solidity
function target() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |




