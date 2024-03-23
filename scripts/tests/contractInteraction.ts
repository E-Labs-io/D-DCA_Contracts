import { Addressable, BigNumberish, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import {
  AcceptedTokens,
  ChainName,
  productionChainImpersonators,
  tokenAddress,
} from "~/bin/tokenAddress";
import { IERC20 } from "~/types/contracts";

export const transferErc20Token = async (
  contract: IERC20,
  to: Addressable,
  amount: BigNumberish,
) => {
  const tx = await contract.transfer(to, amount);
  tx.wait();
};

export const approveErc20Spend = async (
  contract: IERC20,
  to: Addressable,
  amount: BigNumberish,
) => {
  const tx = await contract.approve(to, amount);
  tx.wait();
};

export const getErc20Balance = async (
  contract: IERC20,
  address: string | Addressable,
) => {
  const balance = await contract.balanceOf(address);
  return balance;
};

export const connectToErc20 = async (
  address: string,
  signer: Signer,
): Promise<IERC20> =>
  (await ethers.getContractAt(
    "contracts/tokens/IERC20.sol:IERC20",
    address,
    signer,
  )) as unknown as IERC20;

export const getErc20ImpersonatedFunds = async (
  chain: ChainName,
  to: Addressable,
  amount: BigNumberish,
  token: AcceptedTokens,
): Promise<IERC20> => {
  try {
    const impersonater = productionChainImpersonators[chain]![token]!;
    const impSigner: Signer = await ethers.getImpersonatedSigner(
      impersonater as string,
    );

    const erc20Contract: IERC20 = await connectToErc20(
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

export const checkEthBalanceAndTransfer = async (
  address: string,
  bank: Signer,
  options?: { amount?: BigNumberish; force?: true; topUpTo?: number },
) => {
  const balance = await ethers.provider.getBalance(address);

  if (balance < 1 || options?.force) {
    const message = {
      to: address,
      value: options?.amount ?? ethers.parseEther("1"),
    };
    const tx = await bank.sendTransaction(message);
    await tx.wait();
    const balance = await ethers.provider.getBalance(address);
  } else if (options?.topUpTo) {
    const defisate = options?.topUpTo - Number(balance);
    if (defisate > 0) {
      const message = {
        to: address,
        value: defisate,
      };
      const tx = await bank.sendTransaction(message);
      await tx.wait();
    }
  }
};
