import { HardhatRuntimeEnvironment } from "hardhat/types";
import { forkBlockNumber, masterChain, rcpEndPoints } from "~/hardhat.config";

export async function resetFork(hre: HardhatRuntimeEnvironment) {
  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: rcpEndPoints(masterChain)!,
          blockNumber: forkBlockNumber(),
        },
      },
    ],
  });
}
