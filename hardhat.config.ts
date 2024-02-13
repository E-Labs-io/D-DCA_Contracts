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
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";

import "./tasks";

import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import checkPrivateKeys from "./scripts/checkKeys";
import deploymentConfig from "./bin/deployments.config";

dotenv.config();

console.log("🟢 Hardhat : Mounted.");
// Some quick checks to make sure our .env is working.
const { rcpEndPoints, masterDeployer, etherscanApis, devAccounts } =
  checkPrivateKeys();

const gasPrice = 25000000000;
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
  typechain: {
    outDir: "types/contracts",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
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
    apiKey: etherscanApis,
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
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io",
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
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io",
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
        network: "arbSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },

      {
        network: "eth",
        chainId: 1,
        urls: {
          apiURL: "https://api.etherscan.io/api",
          browserURL: "https://etherscan.io",
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
      {
        network: "matic",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com/",
        },
      },
      {
        network: "maticMumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/",
        },
      },
    ],
  },
  networks: {
    hardhat: {
      gas: "auto",
      chainId: 1,
      forking: {
        url: rcpEndPoints("eth")!,
      },
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    baseGoerli: {
      url: rcpEndPoints("baseGoerli"),
      accounts: devAccounts,
      chainId: 84531,
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
      url: "http://127.0.0.1:8545",
      chainId: 1,
      gasPrice: gasPrice,
    },
  },
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
    disableSync: false, // If set to true, plugin will not sync blocks & txs
    disableTrace: false, // If set to true, plugin won't trace transaction
    workspace: "hardhat", // Set the workspace to use, will default to the default workspace (latest one used in the dashboard). It is also possible to set it through the ETHERNAL_WORKSPACE env variable
    uploadAst: true, // If set to true, plugin will upload AST, and you'll be able to use the storage feature (longer sync time though)
    disabled: deploymentConfig().ethernalEnabled, // If set to true, the plugin will be disabled, nohting will be synced, ethernal.push won't do anything either
    resetOnStart: "hardhat", // Pass a workspace name to reset it automatically when restarting the node, note that if the workspace doesn't exist it won't error
    serverSync: false, // Only available on public explorer plans - If set to true, blocks & txs will be synced by the server. For this to work, your chain needs to be accessible from the internet. Also, trace won't be synced for now when this is enabled.
    skipFirstBlock: false, // If set to true, the first block will be skipped. This is mostly useful to avoid having the first block synced with its tx when starting a mainnet fork
    verbose: false,
  },
  dodoc: {
    runOnCompile: true,
    debugMode: false,
    include: [],
    outputDir: "./docs",
  },
};

export default config;
