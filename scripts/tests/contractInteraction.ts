import { Addressable, Contract } from "ethers";

export const transferErc20Token = async (
  contract: Contract,
  to: string | Addressable,
  amount: number | BigInt,
) => {
  const tx = await contract.transfer(to, amount);
  tx.wait();
};

export const approveTransfer = async (
  contract: Contract,
  to: string,
  amount: number,
) => {
  const tx = await contract.approve(to, amount);
  tx.wait();
};

export const getBalance = async (
  contract: Contract,
  address: string | Addressable,
) => {
  const balance = await contract.balanceOf(address);
  return balance;
};
