/** @format */

import { AddressLike, Addressable } from "ethers";
import deploymentConfig from "./deployments.config";

const forkedNetwork: MainnetNames = deploymentConfig().masterChain;

const productionChainAddresses: {
  [chain in MainnetNames]: { [Item in TokenListKeys]?: string };
} = {
  eth: {
    swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    wbtc: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    compoundV3Usdc: "",
    aaveV3Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    universalRouter: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    gho: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  arbitrum: {
    swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    weth: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    wbtc: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    dai: "",
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    usdt: "",
    compoundV3Usdc: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  matic: {
    swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    weth: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    wbtc: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    dai: "",
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    usdt: "",
    compoundV3Usdc: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  optimism: {
    swapRouter: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    weth: "0x4200000000000000000000000000000000000006",
    wbtc: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    usdt: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    aWeth: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    compoundV3Usdc: "",
    aaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    universalRouter: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  base: {
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    universalRouter: "0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC",
    swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
    weth: "0x4200000000000000000000000000000000000006",
    wbtc: "0x1ceA84203673764244E05693e42E6Ace62bE9BA5",
    dai: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    usdt: "",
    aaveV3Pool: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
    aWeth: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
    aWbtc: "",
  },
};

export const productionChainImpersonators: ImpersonatorList = {
  eth: {
    usdc: "0xD6153F5af5679a75cC85D8974463545181f48772",
    weth: "0x267ed5f71EE47D3E45Bb1569Aa37889a2d10f91e",
    wbtc: "0x693942887922785105088f04E9906D16188E9388",
    usdt: "",
    dai: "",
    gho: "0xE831C8903de820137c13681E78A5780afDdf7697",
  },
  arbitrum: {
    usdc: "0xb38e8c17e38363af6ebdcb3dae12e0243582891d", // Binance Hot wallet (EOA)
    weth: "0x1eed63efba5f81d95bfe37d82c8e736b974f477b", // Random EOA 1
    wbtc: "0x1eed63efba5f81d95bfe37d82c8e736b974f477b", // Random EOA 1
    usdt: "0xb38e8c17e38363af6ebdcb3dae12e0243582891d", // Binance Hot wallet (EOA)
    dai: "0x2d070ed1321871841245d8ee5b84bd2712644322", // Random EOA 2
  },
  optimism: {
    usdc: "0x133FA49A01801264fC05A12EF5ef9Db6a302e93D",
    weth: "0x86bb63148d17d445ed5398ef26aa05bf76dd5b59",
    wbtc: "0xa79a356b01ef805b3089b4fe67447b96c7e6dd4c",
    usdt: "0xf491d040110384DBcf7F241fFE2A546513fD873d",
    dai: "0xd28843e10c3795e51a6e574378f8698afe803029",
  },
  base: {
    usdc: "0xd403c5a0D47cA5301bA3310e1907288A2c2A6536",
    weth: "0x39f1F2AE7708AFe1E383dd503e982db5F3EA153d",
    wbtc: "",
    usdt: "",
    dai: "0x9c52A65e1b3C325Cd7C1a8C01f210fC843746E11",
  },
};

export const tokenAddress: TokenAddressList = {
  swapRouter: {
    eth: productionChainAddresses.eth.swapRouter,
    arbitrum: productionChainAddresses.arbitrum.swapRouter,
    ethGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    ethSepolia: "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E",
    arbGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    opGoerli: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    maticMumbai: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    hardhat: productionChainAddresses[forkedNetwork].swapRouter,
    optimism: productionChainAddresses.optimism.swapRouter,
    base: productionChainAddresses.base.swapRouter,
  },
  universalRouter: {
    eth: productionChainAddresses.eth.universalRouter,
    arbitrum: productionChainAddresses.arbitrum.universalRouter,
    optimism: productionChainAddresses.optimism.universalRouter,
    base: productionChainAddresses.base.universalRouter,
    ethGoerli: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    ethSepolia: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    baseSepolia: "0x050E797f3625EC8785265e1d9BDd4799b97528A1",
    opSepolia: "0xD5bBa708b39537d33F2812E5Ea032622456F1A95",
    arbSepolia: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
    hardhat: productionChainAddresses[forkedNetwork].universalRouter,
  },
  permit2: {
    eth: productionChainAddresses.eth.permit2,
    arbitrum: productionChainAddresses.arbitrum.permit2,
    optimism: productionChainAddresses.optimism.permit2,
    base: productionChainAddresses.base.permit2,
    ethSepolia: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    baseSepolia: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    opSepolia: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    arbSepolia: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    hardhat: productionChainAddresses[forkedNetwork].permit2,
  },
  usdc: {
    eth: productionChainAddresses.eth.usdc,
    arbitrum: productionChainAddresses.arbitrum.usdc,
    ethGoerli: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    ethSepolia: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    arbGoerli: "0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892",
    opGoerli: "0x69529987FA4A075D0C00B0128fa848dc9ebbE9CE",
    maticMumbai: "0x52D800ca262522580CeBAD275395ca6e7598C014",
    hardhat: productionChainAddresses[forkedNetwork].usdc,
    optimism: productionChainAddresses.optimism.usdc,
    base: productionChainAddresses.base.usdc,
  },
  usdt: {
    eth: productionChainAddresses.eth.usdt,
    arbitrum: productionChainAddresses.arbitrum.usdt,
    ethGoerli: "0x3c1373d16927748bba6bee77f14e174593616a7c",
    ethSepolia: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    arbGoerli: "",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].usdt,
    optimism: productionChainAddresses.optimism.usdt,
    base: productionChainAddresses.base.usdt,
  },
  weth: {
    eth: productionChainAddresses.eth.weth,
    arbitrum: productionChainAddresses.arbitrum.weth,
    ethGoerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    ethSepolia: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
    arbGoerli: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    opGoerli: "0x4200000000000000000000000000000000000006",
    maticMumbai: "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
    hardhat: productionChainAddresses[forkedNetwork].weth,
    optimism: productionChainAddresses.optimism.weth,
    base: productionChainAddresses.base.weth,
  },
  wbtc: {
    eth: productionChainAddresses.eth.wbtc,
    ethGoerli: "",
    ethSepolia: "0x29f2D40B0605204364af54EC677bD022dA425d03",
    arbGoerli: "0x22d5e2dE578677791f6c90e0110Ec629be9d5Fb5",
    arbitrum: productionChainAddresses.arbitrum.wbtc,
    opGoerli: "0x099E6dA9FFF9F0D8873AaD3FB4C9F7eDA5742692",
    maticMumbai: "0x2Fa2e7a6dEB7bb51B625336DBe1dA23511914a8A",
    hardhat: productionChainAddresses[forkedNetwork].wbtc,
    optimism: productionChainAddresses.optimism.wbtc,
    base: productionChainAddresses.base.wbtc,
  },
  link: {
    eth: "",
    ethGoerli: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    ethSepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    arbGoerli: "",
    opGoerli: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
    maticMumbai: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    hardhat: "",
  },
  compoundV3Usdc: {
    eth: productionChainAddresses.eth.compoundV3Usdc,
    ethGoerli: "",
    ethSepolia: "",
    arbGoerli: "0x1d573274E19174260c5aCE3f2251598959d24456",
    arbitrum: productionChainAddresses.arbitrum.compoundV3Usdc,
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork].compoundV3Usdc,
    optimism: productionChainAddresses.optimism.compoundV3Usdc,
  },
  aaveV3Pool: {
    eth: productionChainAddresses.eth.aaveV3Pool,
    ethGoerli: "",
    ethSepolia: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    arbGoerli: "0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c",
    arbitrum: productionChainAddresses.arbitrum.aaveV3Pool,
    opGoerli: "0x52dCE39f4A3823b335732178364f5590bDacb25D",
    hardhat: productionChainAddresses[forkedNetwork].aaveV3Pool,
    base: productionChainAddresses.base.aaveV3Pool,

    optimism: productionChainAddresses.optimism.aaveV3Pool,
  },
  gho: {
    eth: productionChainAddresses.eth.gho,
    ethGoerli: "",
    ethSepolia: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
    arbGoerli: "",
    arbitrum: "",
    opGoerli: "",
    hardhat: productionChainAddresses[forkedNetwork]!.gho,
  },
  ccipRouter: {
    opGoerli: "0xcc5a0B910D9E9504A7561934bed294c51285a78D",
    ethSepolia: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    baseGoerli: "0x80AF2F44ed0469018922c9F483dc5A909862fdc2",
    arbSepolia: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    maticMumbai: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
  },
  aaveFaucet: {
    ethSepolia: "0xC959483DBa39aa9E78757139af0e9a2EDEb3f42D",
    maticMumbai: "0x2c95d10bA4BBEc79e562e8B3f48687751808C925",
  },
  aWeth: {
    eth: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
    optimism: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    base: productionChainAddresses.base.aWeth,
  },
  aWbtc: {
    optimism: "0x078f358208685046a11C85e8ad32895DED33A249",
    base: productionChainAddresses.base.aWbtc,
  },
};

export type AcceptedTokens =
  | "weth"
  | "wbtc"
  | "eth"
  | "usdc"
  | "usdt"
  | "dai"
  | "gho"
  | "link"
  | "aWeth"
  | "aWbtc";

export type AcceptedProtocolsAndContracts =
  | "aaveFaucet"
  | "aaveV3Pool"
  | "swapRouter"
  | "universalRouter"
  | "compoundV3Usdc"
  | "ccipRouter"
  | "permit2";

export type TokenListKeys = AcceptedProtocolsAndContracts | AcceptedTokens;
export type TokenAddressList = {
  [contract in TokenListKeys]?: TokenChainList;
};

export type TokenChainList = {
  [chain in ChainName]?: AddressLike;
};

export type ImpersonatorList = {
  [chain in ChainName]?: {
    [contract in AcceptedTokens]?: string | Addressable;
  };
};
export type ChainName = MainnetNames | TestNetNames;
export type MainnetNames = "eth" | "arbitrum" | "optimism" | "matic" | "base";

export type TestNetNames =
  | "ethGoerli"
  | "ethSepolia"
  | "arbGoerli"
  | "arbSepolia"
  | "opGoerli"
  | "opSepolia"
  | "maticMumbai"
  | "baseSepolia"
  | "baseGoerli"
  | "hardhat"
  | "localhost";
