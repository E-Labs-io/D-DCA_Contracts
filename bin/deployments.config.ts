/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName } from "./tokenAddress";

// BlockToken BlockSales BlockStore

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: ChainName = "eth";
  const forkBlockNumber = () => {
    const list: { [chain in ChainName]?: number } = {
      eth: 19482918,
      optimism: 21838708,
    };

    return list[masterChain];
  };
  const ethernalDisabled: boolean = true;

  return { deployCue, ethernalDisabled, masterChain, forkBlockNumber };
}
