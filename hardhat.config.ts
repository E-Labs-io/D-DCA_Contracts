/** @format */

import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "tsconfig-paths/register";
import "hardhat-ethernal";

import "./tasks";

import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import checkPrivateKeys from "./scripts/checkKeys";

dotenv.config();

console.log("🟢 Hardhat : Mounted.");

// Some quick checks to make sure our .env is working.
const { rcpEndPoints, masterMnemonic, devRecovery } = checkPrivateKeys();

const gasPrice = 1000000000;
console.log("❗️Gas Price Set: ", gasPrice / 10 ** 9, "gwei");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  //  PLUGINS
  typechain: {
    outDir: "types/contracts",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
  },
  dodoc: {
    runOnCompile: true,
    debugMode: false,
    include: [],
    outputDir: "./docs",

    // More options...
  },
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
    disableSync: false, // If set to true, plugin will not sync blocks & txs
    disableTrace: false,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
    customChains: [
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "opGoerli",
        chainId: 420,
        urls: {
          apiURL: "https://api-goerli-optimistic.etherscan.io/api",
          browserURL: "https://goerli-optimism.etherscan.io",
        },
      },
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io",
        },
      },
      {
        network: "arbGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io",
        },
      },
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io",
        },
      },
      {
        network: "ethSepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
      {
        network: "ethGoerli",
        chainId: 5,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io",
        },
      },
    ],
  },

  //  File Structure
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./build/artifacts",
  },
  gasReporter: {
    currency: "ETH",
    gasPrice: 1000000000 ** 9,
    enabled: true,
    outputFile: "./reports",
  },

  networks: {
    hardhat: {
      chainId: 420,
      forking: {
        url: `https://arb1.arbitrum.io/rpc`,
      },
    },
    baseGoerli: {
      url: rcpEndPoints.baseGoerli,
      accounts: [masterMnemonic],
      chainId: 84531,
      gasPrice: gasPrice,
    },
    opGoerli: {
      url: rcpEndPoints.opGoerli,
      accounts: [masterMnemonic],
      chainId: 420,
      gasPrice: gasPrice,
    },
    optimism: {
      url: rcpEndPoints.optimism,
      accounts: [masterMnemonic],
      chainId: 10,
      gasPrice: gasPrice,
    },
    arbGoerli: {
      url: rcpEndPoints.arbGoerli,
      accounts: [masterMnemonic],
      chainId: 421613,
      gasPrice: gasPrice,
    },
    arbitrum: {
      url: rcpEndPoints.arbitrim,
      accounts: [masterMnemonic],
      chainId: 42161,
      gasPrice: gasPrice,
    },
    ethSepolia: {
      url: rcpEndPoints.ethSepolia,
      accounts: [masterMnemonic],
      chainId: 11155111,
      gasPrice: gasPrice,
    },
    mumbai: {
      url: rcpEndPoints.mumbai,
      chainId: 80001,
      accounts: [masterMnemonic],
      gasPrice: gasPrice,
    },
    eth: {
      url: rcpEndPoints.eth,
      chainId: 1,
      accounts: [masterMnemonic],
      gasPrice: gasPrice,
    },
    ethGoerli: {
      url: rcpEndPoints.ethGoerli,
      accounts: [masterMnemonic],
      chainId: 5,
      gasPrice: gasPrice,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 420,
      accounts: { mnemonic: devRecovery, initialIndex: 0, count: 5 },
      gasPrice: gasPrice,
    },
  },
};

export default config;
