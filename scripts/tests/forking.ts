import { HardhatRuntimeEnvironment } from "hardhat/types";
import { forkBlockNumber, masterChain, rcpEndPoints } from "~/hardhat.config";

export async function resetFork(hre: HardhatRuntimeEnvironment) {
  const block = forkBlockNumber();

  // Only reset fork if running on hardhat network
  if (hre.network.name === "tenderlyBaseVTN") {
    console.warn(
      `[resetFork] Skipped — running on non-resettable network: ${hre.network.name}`,
    );
    return;
  }
  block && block > 0
    ? await hre.network.provider.request({
        method: "hardhat_reset",
        params: [
          {
            forking: {
              jsonRpcUrl: rcpEndPoints(masterChain)!,
              blockNumber: block,
            },
          },
        ],
      })
    : await hre.network.provider.request({
        method: "hardhat_reset",
        params: [
          {
            forking: {
              jsonRpcUrl: rcpEndPoints(masterChain)!,
            },
          },
        ],
      });
}
