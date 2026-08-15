/** @format */

import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "tsconfig-paths/register";
// hardhat-ethernal removed: incompatible with hardhat >=2.23 internals
// and was permanently disabled in config anyway.
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";

import "./tasks";

import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import checkPrivateKeys from "./scripts/checkKeys";
import deploymentConfig from "./bin/deployments.config";

//import "@tenderly/hardhat-tenderly";

dotenv.config();

console.log("🟢 Hardhat : Mounted.");
// Some quick checks to make sure our .env is working.
export const {
  rcpEndPoints,
  masterDeployer,
  etherscanApis,
  devAccounts,
  chainIds,
} = checkPrivateKeys();
export const { masterChain, forkBlockNumber } = deploymentConfig();

const gasPrice = 25000000000;
console.log("❗️Gas Price Set: ", gasPrice / 10 ** 9, "gwei");
console.log("❗️Forked Chain: ", masterChain);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        // Bumped from 0.8.20 in V0.9 — free wins: MCOPY opcode for memory
        // moves on Cancun-capable chains (Base, Optimism, Ethereum),
        // cheaper push0 on all EVM targets. Our sources use ^0.8.20 so
        // they resolve to this compiler.
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        // Retained for vendored Compound V3 interface files which pin to
        // exactly 0.8.20 (not ^0.8.20). Harmless to keep around — those
        // files are interface-only.
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "types/contracts",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    dontOverrideCompile: false, // defaults to false
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./build/artifacts",
  },
  gasReporter: {
    token: "ETH",
    currency: "USD",
    enabled: true,
    gasPriceApi: process.env.ETHERSCAN_MAINNET_GAS_POINT,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    // Etherscan API V2: one key (from etherscan.io) serves every chain,
    // routed via api.etherscan.io/v2 with a chainid param. The old
    // per-explorer customChains entries forced deprecated V1 endpoints
    // and are gone — hardhat-verify's built-in chain registry covers
    // base/baseSepolia/optimism/arbitrum/mainnet/sepolia natively.
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  networks: {
    tenderlyBase: {
      url: "https://virtual.base.rpc.tenderly.co/120c0003-2c5c-4f50-a746-5d1c783c8148",
      chainId: 8453, // use the chain ID Tenderly gives you
    },
    fork: {
      gas: "auto",
      chainId: chainIds[masterChain],
      url: rcpEndPoints(masterChain)!,
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    hardhat: {
      gas: "auto",
      chainId: chainIds[masterChain],
      forking: {
        enabled: true,
        url: rcpEndPoints(masterChain)!,
        blockNumber: forkBlockNumber(),
      },
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    base: {
      url: rcpEndPoints("base"),
      accounts: devAccounts,
      chainId: chainIds.base,
      gasPrice: gasPrice,
    },
    baseGoerli: {
      url: rcpEndPoints("baseGoerli"),
      accounts: devAccounts,
      chainId: chainIds.baseGoerli,
      gasPrice: gasPrice,
    },
    baseSepolia: {
      url: rcpEndPoints("baseSepolia"),
      accounts: devAccounts,
      chainId: chainIds.baseSepolia,
      gasPrice: gasPrice,
    },
    optimism: {
      url: rcpEndPoints("optimism"),
      accounts: devAccounts,
      chainId: 10,
      gasPrice: gasPrice,
    },
    opGoerli: {
      url: rcpEndPoints("opGoerli"),
      accounts: devAccounts,
      chainId: 420,
      gasPrice: gasPrice,
    },
    arbGoerli: {
      url: rcpEndPoints("arbGoerli"),
      accounts: devAccounts,
      chainId: 421613,
      gasPrice: gasPrice,
    },
    arbSepolia: {
      url: rcpEndPoints("arbSepolia"),
      accounts: devAccounts,
      chainId: 421614,
      gasPrice: gasPrice,
    },
    arbitrum: {
      url: rcpEndPoints("arbitrum"),
      accounts: [masterDeployer],
      chainId: 42161,
      gasPrice: gasPrice,
    },
    matic: {
      url: rcpEndPoints("matic"),
      chainId: 137,
      accounts: devAccounts,
      gasPrice: gasPrice,
    },
    maticMumbai: {
      url: rcpEndPoints("maticMumbai"),
      chainId: 80001,
      accounts: devAccounts,
      gasPrice: gasPrice,
    },
    eth: {
      url: rcpEndPoints("eth"),
      chainId: 1,
      accounts: devAccounts,
      gasPrice: gasPrice,
    },
    ethGoerli: {
      url: rcpEndPoints("ethGoerli"),
      accounts: devAccounts,
      chainId: 5,
      gasPrice: gasPrice,
    },
    ethSepolia: {
      url: rcpEndPoints("ethSepolia"),
      accounts: devAccounts,
      chainId: 11155111,
      gasPrice: gasPrice,
    },
    localhost: {
      url: "HTTP://192.168.0.41:7545",
      chainId: 5777,
      gasPrice: gasPrice,
    },
  },
  dodoc: {
    runOnCompile: true,
    debugMode: false,
    include: [],
    outputDir: "./docs",
  },

  /*   tenderly: {
    project: "dca",
    username: "E-Labs",
    privateVerification: true,
  }, */
};

export default config;
