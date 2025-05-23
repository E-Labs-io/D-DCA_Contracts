/** @format */

import { AddressLike, Addressable } from "ethers";
import { ChainName, tokenAddress } from "../../bin/tokenAddress";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deployedDCAContracts from "~/bin/deployedAddress";
import { EMPTY_REINVEST_OBJECT } from "~/bin/emptyData";

const deployedAddresses = (networkName: ChainName) =>
  deployedDCAContracts[networkName]!;

export function DCAExecutorArguments(
  deployer: string | Addressable,
  networkName: string,
): any[] {
  const feeDistrobution_: IDCADataStructures.FeeDistributionStruct = {
    amountToAdmin: 2500, //  25%
    amountToComputing: 0, //  45%
    amountToExecutor: 7500, //  25%
    feeAmount: 30, //  0.3%
    executionAddress: "0xe272653f2FF11D1F7bd24cdE149a29f4110d03B1",
    computingAddress: "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1",
    adminAddress: deployer,
  };
  const executionEOA_: AddressLike =
    "0xe272653f2FF11D1F7bd24cdE149a29f4110d03B1";

  return [feeDistrobution_, executionEOA_];
}

export function DCAAccountArguments(
  deployer: string | Addressable,
  networkName: string,
): any[] {
  const executorAddress_: AddressLike = deployedAddresses(
    networkName as ChainName,
  ).DCAExecutor as AddressLike;
  const swapRouter_: AddressLike =
    tokenAddress.swapRouter![networkName as ChainName]!;

  const owner_: AddressLike = deployer;

  const reinvestLibraryContract_ = deployedAddresses(
    networkName as ChainName,
  ).DCAReinvest;

  return [executorAddress_, swapRouter_, owner_, reinvestLibraryContract_];
}

export function DCAAccountFactoryArguments(
  deployer: string | Addressable,
  networkName: string,
): any[] {
  const executorAddress_: AddressLike = deployedAddresses(
    networkName as ChainName,
  ).DCAExecutor as AddressLike;
  const swapRouter_: AddressLike =
    tokenAddress.swapRouter![networkName as ChainName]!;

  const reinvestLibraryContract_ = deployedAddresses(
    networkName as ChainName,
  ).DCAReinvest;

  return [executorAddress_, swapRouter_, reinvestLibraryContract_];
}

export function DCAReinvestLibraryArguments(
  deployer: string | Addressable,
  networkName: string,
): any[] {
  const activate_ = true;

  return [activate_];
}

export const newStrat = (
  accountAddress: string,
  network: string,
  reinvest?: IDCADataStructures.ReinvestStruct,
): IDCADataStructures.StrategyStruct => {
  return {
    accountAddress: accountAddress,
    baseToken: {
      tokenAddress: tokenAddress.usdc![network as ChainName]!,
      decimals: 6,
      ticker: "USDC",
    },
    targetToken: {
      tokenAddress: tokenAddress.weth![network as ChainName]!,
      decimals: 18,
      ticker: "WETH",
    },
    interval: 0,
    amount: 100000000,
    reinvest: reinvest ?? EMPTY_REINVEST_OBJECT,
    active: false,
    strategyId: 1,
  };
};

export const buildStrat = (
  accountAddress: string,
  network: string,

  options?: {
    baseToken?: IDCADataStructures.TokenDataStruct;
    targetToken?: IDCADataStructures.TokenDataStruct;
    reinvest?: IDCADataStructures.ReinvestStruct;
    amount?: number;
    interval?: number;
    strategyId?: number;
  },
): IDCADataStructures.StrategyStruct => {
  return {
    accountAddress: accountAddress,
    baseToken: options?.baseToken ?? {
      tokenAddress: tokenAddress.usdc![network as ChainName]!,
      decimals: 6,
      ticker: "USDC",
    },
    targetToken: options?.targetToken ?? {
      tokenAddress: tokenAddress.weth![network as ChainName]!,
      decimals: 18,
      ticker: "WETH",
    },
    interval: options?.interval ?? 0,
    amount: options?.amount ?? 100000000,
    reinvest: options?.reinvest ?? EMPTY_REINVEST_OBJECT,
    active: false,
    strategyId: options?.strategyId ?? 1,
  };
};
