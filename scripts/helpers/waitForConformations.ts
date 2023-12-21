/** @format */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import delay from "./delay";

async function waitForConfirmations(
  hre: HardhatRuntimeEnvironment,
  txHash: string,
  confirmations: number
): Promise<void> {
  const provider = hre.ethers.provider;

  // Get the transaction receipt
  const txReceipt = await provider.getTransactionReceipt(txHash);
  if (!txReceipt) {
    throw new Error(`Transaction receipt not found for hash: ${txHash}`);
  }

  let currentBlock = await provider.getBlockNumber();
  while ((await txReceipt.confirmations()) < confirmations) {
    await delay(3000, true); // Delay for 1 second (or appropriate time)
    currentBlock = await provider.getBlockNumber();
  }
}

export default waitForConfirmations;
