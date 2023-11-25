/** @format */

import { AddressLike } from "ethers";

export const tokenAddress: TokenAddressList = {
  swapRouter: {
    eth: "",
    ethGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    ethSepolia: "",
    arbGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    opGoerli: "",
    hardhat: "",
  },
  universalRouter: {
    eth: "",
    ethGoerli: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: "",
  },
  usdc: {
    eth: "",
    ethGoerli: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    ethSepolia: "",
    arbGoerli: "0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892",
    opGoerli: "",
    hardhat: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  usdt: {
    eth: "",
    ethGoerli: "0x3c1373d16927748bba6bee77f14e174593616a7c",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  weth: {
    eth: "",
    ethGoerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    ethSepolia: "",
    arbGoerli: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    opGoerli: "",
    hardhat: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  wbtc: {
    eth: "",
    ethGoerli: "",
    ethSepolia: "",
    arbGoerli: "0x22d5e2dE578677791f6c90e0110Ec629be9d5Fb5",
    opGoerli: "",
    hardhat: "",
  },
  link: {
    eth: "",
    ethGoerli: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: "",
  },
};

export interface TokenAddressList {
  [contract: string]: TokenChainList;
}

export type TokenChainList = {
  [chain in ChainName]?: AddressLike;
};

export type ChainName =
  | "eth"
  | "ethGoerli"
  | "ethSepolia"
  | "arbGoerli"
  | "opGoerli"
  | "optimism"
  | "opGoerli"
  | "arbitrum"
  | "baseGoerli"
  | "hardhat";
