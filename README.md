<!-- @format -->

# DCA Contracts V1

## Setup

Fork the project, minover into the project directory and run

```bash
npm run install
```

## Commands

**Deploy**

```bash
npx hardhat deploy contractName1 contractName2 --network [network]
```

**Deploy Proxy Contract**

```bash
npx hardhat deployProxy --contractname [contractName] --network [network]
```

**Upgrade Proxy**

```bash
npx hardhat upgradeProxy --contractname [contractName] --proxyaddress [proxyAddress] --network [network]
```

### Spesific Commands

**Deploy the Reinvest** Library as proxy.

```bash
npx hardhat deployProxy --contractname DCAReinvestLibrary --network ethGoerli
```

**Upgrade the Reinvest libaray** contract to the latest, replace the contract name with the new contract name (should be versioned)

```bash
npx hardhat upgradeProxy --contractname DCAReinvestLibraryV2 --proxyaddress --network ethGoerli
```

Deployment Order

```bash
// Deploy Reinvest library
npm run compile

npx hardhat deployContracts DCAReinvest DCAExecutor --network ethGoerli
> returns contract addresss - {DCAReinvestAddress, DCAExecutorAddress}
// Copy the address into the deployed Address object & anyother configs

npx hardhat deployContracts DCAAccount DCAFactory --network ethGoerli
> returns contract addresss - {DCAAccountAddress, DCAFactoryAddress}


```

## Deployments

* Ethereum Goerli
  * DCAExecutor
  * DCAAccount Single
  * DCAFactory
  * DCAReinvestProxy
  * DCAReinvest Current
* Arbitrum Goerli
  * DCAExecutor
  * DCAAccount Single
  * DCAFactory
  * DCAReinvestProxy
  * DCAReinvest Current
* Arbitrum Mainnet
  * DCAExecutor
  * DCAAccount Single
  * DCAFactory
  * DCAReinvestProxy
  * DCAReinvest Current


