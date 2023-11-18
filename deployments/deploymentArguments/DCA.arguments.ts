/** @format */

import { AddressLike, Addressable, ZeroAddress } from "ethers";
import { ChainName, tokenAddress } from "../../bin/tokenAddress";
import { IDCADataStructures } from "~/types/contracts/contracts/DCAExecutor";

export function DCAExecutorArguments(
  deployer: string | Addressable,
  networkName: string
): any[] {
  const feeDistrobution_: IDCADataStructures.FeeDistributionStruct = {
    amountToAdmin: 2000, //  20%
    amountToComputing: 4500, //  45%
    amountToExecutor: 3500, //  35%
    feeAmount: 30, //  0.2%
    executionAddress: "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1",
    computingAddress: "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1",
    adminAddress: deployer,
  };
  const executionEOA_: AddressLike =
    "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1";

  return [feeDistrobution_, executionEOA_];
}

export function DCAAccountArguments(
  deployer: string | Addressable,
  networkName: string
): any[] {
  const executorAddress_: AddressLike =
    "0xfC73Ad879EB3F30FE58d2794e83BAac9e0717E0D";
  const swapRouter_: AddressLike =
    tokenAddress.swapRouter[networkName as ChainName]!;

  const owner_: AddressLike = deployer;

  return [executorAddress_, swapRouter_, owner_];
}

export function DCAAccountFactoryArguments(
  deployer: string | Addressable,
  networkName: string
): any[] {
  const executorAddress_: AddressLike = "";
  const swapRouter_: AddressLike =
    tokenAddress.swapRouter[networkName as ChainName]!;

  return [executorAddress_, swapRouter_];
}

export const newStrat = (
  accountAddress: string,
  network: string
): IDCADataStructures.StrategyStruct => {
  return {
    accountAddress: accountAddress,
    baseToken: {
      tokenAddress: tokenAddress.usdc[network as ChainName]!,
      decimals: 6,
      ticker: "USDC",
    },
    targetToken: {
      tokenAddress: tokenAddress.weth[network as ChainName]!,
      decimals: 18,
      ticker: "WETH",
    },
    interval: 1,
    amount: 1000000,
    reinvest: false,
    active: false,
    reinvestCallData: "0x0000000000000000000000000000000000000000",
    strategyId: 2,
  };
};
