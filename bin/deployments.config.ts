/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName } from "./tokenAddress";

// BlockToken BlockSales BlockStore

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: ChainName = "eth";
  const ethernalEnabled: boolean = true;

  return { deployCue, ethernalEnabled, masterChain };
}
