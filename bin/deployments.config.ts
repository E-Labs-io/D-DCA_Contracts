/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName, MainnetNames } from "./tokenAddress";

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: MainnetNames = "base";
  const forkBlockNumber = () => {
    const list: { [chain in MainnetNames]?: number } = {
      eth: 19493637,
      optimism: 117776650,
    };

    return list[masterChain];
  };
  const ethernalDisabled: boolean = true;

  return { deployCue, ethernalDisabled, masterChain, forkBlockNumber };
}
