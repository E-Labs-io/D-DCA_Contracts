// utils/time.ts

import { ethers } from "hardhat";

/**
 * Advances the blockchain time by the given number of seconds.
 * @param seconds The number of seconds to advance.
 */
export async function advanceTime(seconds: number): Promise<void> {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}

/**
 * Advances the blockchain to a specific timestamp.
 * @param timestamp The target timestamp to advance to.
 */
export async function advanceToTimestamp(timestamp: number): Promise<void> {
  const currentBlock = await ethers.provider.getBlock("latest");
  if (!currentBlock) throw new Error("Failed to get latest block");
  const currentTime = currentBlock.timestamp;

  if (timestamp > currentTime) {
    const secondsToAdvance = timestamp - currentTime;
    await advanceTime(secondsToAdvance);
  }
}               
