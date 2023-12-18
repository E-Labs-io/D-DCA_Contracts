/** @format */

import { AddressLike } from "ethers";

const productionChainAddresses = {
  eth: {
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    wbtc: "",
    dai: "",
    usdc: "",
    usdt: "",
    compoundV3Usdc: "",
    aaveV3Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    universalRouter: "",
  },
  arbitrum: {
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    weth: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    wbtc: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    dai: "",
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    usdt: "",
    compoundV3Usdc: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "",
  },
  polygon: {
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    weth: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    wbtc: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    dai: "",
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    usdt: "",
    compoundV3Usdc: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "",
  },
  optimism: {
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    weth: "0x4200000000000000000000000000000000000006",
    wbtc: "",
    dai: "",
    usdc: "",
    usdt: "",
    compoundV3Usdc: "",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "",
  },
};

const forkedNetwork: ChainName = "arbitrum";

export const tokenAddress: TokenAddressList = {
  swapRouter: {
    eth: productionChainAddresses.eth.swapRouter,
    arbitrum: productionChainAddresses.arbitrum.swapRouter,
    ethGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    ethSepolia: "",
    arbGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].swapRouter,
  },
  universalRouter: {
    eth: productionChainAddresses.eth.universalRouter,
    arbitrum: productionChainAddresses.arbitrum.universalRouter,
    ethGoerli: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].universalRouter,
  },
  usdc: {
    eth: productionChainAddresses.eth.usdc,
    arbitrum: productionChainAddresses.arbitrum.usdc,
    ethGoerli: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    ethSepolia: "",
    arbGoerli: "0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].usdc,
  },
  usdt: {
    eth: productionChainAddresses.eth.usdt,
    arbitrum: productionChainAddresses.arbitrum.usdt,
    ethGoerli: "0x3c1373d16927748bba6bee77f14e174593616a7c",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].usdt,
  },
  weth: {
    eth: productionChainAddresses.eth.weth,
    arbitrum: productionChainAddresses.arbitrum.weth,
    ethGoerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    ethSepolia: "",
    arbGoerli: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].weth,
  },
  wbtc: {
    eth: productionChainAddresses.eth.wbtc,
    ethGoerli: "",
    ethSepolia: "",
    arbGoerli: "0x22d5e2dE578677791f6c90e0110Ec629be9d5Fb5",
    arbitrum: productionChainAddresses.arbitrum.wbtc,
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].wbtc,
  },
  link: {
    eth: "",
    ethGoerli: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    ethSepolia: "",
    arbGoerli: "",
    opGoerli: "",
    hardhat: "",
  },
  compoundV3USDC: {
    eth: productionChainAddresses.eth.compoundV3Usdc,
    ethGoerli: "",
    ethSepolia: "",
    arbGoerli: "0x1d573274E19174260c5aCE3f2251598959d24456",
    arbitrum: productionChainAddresses.arbitrum.compoundV3Usdc,
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].compoundV3Usdc,
  },
  aaveV3Pool: {
    eth: productionChainAddresses.eth.aaveV3Pool,
    ethGoerli: "",
    ethSepolia: "",
    arbGoerli: "0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c",
    arbitrum: productionChainAddresses.arbitrum.aaveV3Pool,
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].aaveV3Pool,
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
