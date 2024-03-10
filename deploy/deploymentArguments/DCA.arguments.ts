/** @format */

import { AddressLike, Addressable, ZeroAddress, ethers } from "ethers";
import { ChainName, tokenAddress } from "../../bin/tokenAddress";
import {
  DCAExecutor,
  IDCADataStructures,
} from "~/types/contracts/contracts/base/DCAExecutor";
import deployedDCAContracts from "~/bin/deployedAddress";
import { DCAReinvest } from "~/types/contracts/contracts/base/DCAAccount";

const deployedAddresses = (networkName: ChainName) =>
  deployedDCAContracts[networkName]!;

export function DCAExecutorArguments(
  deployer: string | Addressable,
  networkName: string,
): any[] {
  const feeDistrobution_: IDCADataStructures.FeeDistributionStruct = {
    amountToAdmin: 2000, //  20%
    amountToComputing: 4500, //  45%
    amountToExecutor: 3500, //  35%
    feeAmount: 50, //  0.3%
    executionAddress: "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1",
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
  reinvest?: DCAReinvest.ReinvestStruct,
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
    reinvest: reinvest ?? {
      reinvestData: "0x00",
      active: false,
      investCode: "0x00",
      dcaAccountAddress: accountAddress,
    },
    active: false,
    strategyId: 1,
  };
};
