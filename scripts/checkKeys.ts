/** @format */

import dotenv from "dotenv";
import { ChainName } from "../bin/tokenAddress";
dotenv.config();

export default function checkPrivateKeys() {
  if (!process.env.MASTER_DEPLOYER_KEY) {
    console.log("🛑 Private key not found.");
    throw "No Private Keys";
  }
  if (!process.env.ALCHEMY_KEY) {
    console.log("🛑 Alchemy API not found.");
    throw "No Alchemy API";
  }
  console.log("🟢 Private key found.");
  const masterDeployer = `0x${process.env.MASTER_DEPLOYER_KEY}`;
  const rcpEndPoints = (net?: ChainName): string => {
    const rpc: { [chain in ChainName]?: string } = {
      baseGoerli: `https://base-goerli.public.blastapi.io`,
      maticMumbai: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MATICMUMBAI_KEY}`,
      matic: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MATICMUMBAI_KEY}`,
      eth: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      ethSepolia: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`,
      optimism: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      opGoerli: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_OPGOERLI_KEY}`,
      arbGoerli: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      arbSepolia: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ARBSEPOLIA_KEY}`,
      arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      ethGoerli: `https:/eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
    };

    let result = net ? rpc[net] : rpc.ethGoerli;
    return result!;
  };

  const etherscanApis: { [chain in ChainName]?: string } = {
    eth: process.env.ETHERSCAN_API_KEY_ETH!,
    ethSepolia: process.env.ETHERSCAN_API_KEY_ETH!,
    ethGoerli: process.env.ETHERSCAN_API_KEY_ETH!,
    optimism: process.env.ETHERSCAN_API_KEY_OP!,
    opGoerli: process.env.ETHERSCAN_API_KEY_OP!,
    opSepolia: process.env.ETHERSCAN_API_KEY_OP!,
    matic: process.env.ETHERSCAN_API_KEY_MATIC!,
    maticMumbai: process.env.ETHERSCAN_API_KEY_MATIC!,
    arbitrum: process.env.ETHERSCAN_API_KEY_ARBITRUM!,
    arbGoerli: process.env.ETHERSCAN_API_KEY_ARBITRUM!,
    arbSepolia: process.env.ETHERSCAN_API_KEY_ARBITRUM!,
  };

  const chainIds: { [chain in ChainName]?: number } = {
    eth: 1,
    ethGoerli: 5,
    ethSepolia: 11155111,
    optimism: 10,
    opGoerli: 420,
    opSepolia: 11155112,
    arbitrum: 42161,
    arbGoerli: 421613,
    arbSepolia: 11155420,
    baseGoerli: 84531,
    matic: 137,
    maticMumbai: 80001,
  };

  const devAccounts = [
    masterDeployer,
    `0x${process.env.USER_ACCOUNT_1_KEY}`,
    `0x${process.env.USER_ACCOUNT_2_KEY}`,
    `0x${process.env.USER_ACCOUNT_3_KEY}`,
    `0x${process.env.USER_ACCOUNT_4_KEY}`,
  ];

  return {
    rcpEndPoints,
    masterDeployer,
    etherscanApis,
    chainIds,
    devAccounts,
  };
}

// Sepolia versions
// free - https://sepolia.drpc.org
// Alchemy - `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
