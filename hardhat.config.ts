import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "@primitivefi/hardhat-dodoc";
import "@nomicfoundation/hardhat-toolbox";
import "@truffle/dashboard-hardhat-plugin";
import "hardhat-local-networks-config-plugin";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";

import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import checkPrivateKeys from "./scripts/checkKeys";

dotenv.config();

console.log("🟢 Hardhat : Mounted.");

// Some quick checks to make sure our .env is working.
const { rcpEndPoints, masterMnemonic } = checkPrivateKeys();

const config: HardhatUserConfig = {
    solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
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
    debugMode: true,

    // More options...
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
    customChains: [
      {
        network: "base-goerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
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

  networks: {
    hardhat: {},
    "base-goerli": {
      url: rcpEndPoints.baseGoerli,
      accounts: [masterMnemonic],
      chainId: 84531,
      gasPrice: gasPrice,
    },
    sepolia: {
      url: rcpEndPoints.sepolia,
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
    mainnet: {
      url: rcpEndPoints.homestead,
      chainId: 1,
      accounts: [masterMnemonic],
      gasPrice: gasPrice,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 420,
      accounts: [masterMnemonic],
      gasPrice: gasPrice,
    },
  },
};

export default config;
