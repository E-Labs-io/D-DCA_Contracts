/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName, MainnetNames } from "./tokenAddress";

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: MainnetNames = "base";
  const forkBlockNumber = () => {
    const list: { [chain in MainnetNames]?: number | undefined } = {
      eth: 19493637,
      optimism: 117776650,
      base: 0,
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
