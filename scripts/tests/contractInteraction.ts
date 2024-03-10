import { Addressable, BaseContract, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import {
  AcceptedTokens,
  ChainName,
  productionChainImpersonators,
  tokenAddress,
} from "~/bin/tokenAddress";

export const transferErc20Token = async (
  contract: Contract,
  to: string | Addressable,
  amount: number | BigInt,
) => {
  const tx = await contract.transfer(to, amount);
  tx.wait();
};

export const approveErc20Spend = async (
  contract: Contract,
  to: string,
  amount: number | BigInt,
) => {
  const tx = await contract.approve(to, amount);
  tx.wait();
};

export const getErc20Balance = async (
  contract: Contract,
  address: string | Addressable,
) => {
  const balance = await contract.balanceOf(address);
  return balance;
};

export const connectToErc20 = async (
  address: string,
  signer: Signer,
): Promise<Contract> =>
  ethers.getContractAt("contracts/tokens/IERC20.sol:IERC20", address, signer);

export const getErc20ImpersonatedFunds = async (
  chain: ChainName,
  to: string | Addressable,
  amount: number | BigInt,
  token: AcceptedTokens,
): Promise<Contract> => {
  try {
    const impersonater = productionChainImpersonators[chain]![token]!;
    const impSigner: Signer = await ethers.getImpersonatedSigner(
      impersonater as string,
    );

    const erc20Contract = await connectToErc20(
      tokenAddress[token]![chain] as string,
      impSigner,
    );
    const tx = await erc20Contract.transfer(to, amount);
    await tx.wait();
    return erc20Contract;
  } catch (error) {
    console.log("getErc20ImpersonatedFunds Error: ", error);
    throw error;
  }
};
