/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName, MainnetNames } from "./tokenAddress";

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: MainnetNames = "eth";
  const forkBlockNumber = () => {
    const list: { [chain in MainnetNames]?: number } = {
      eth: 19493637,
      optimism: 117776650,
      base: 28709051,
    };

    return list[masterChain];
  };
  const ethernalDisabled: boolean = true;

  const tenderly = false;

  return {
    deployCue,
    ethernalDisabled,
    masterChain,
    forkBlockNumber,
    tenderly,
  };
}
