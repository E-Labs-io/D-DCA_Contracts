/** @format */

import { ContractNames } from "./deployedAddress";
import { ChainName } from "./tokenAddress";

// BlockToken BlockSales BlockStore

export default function deploymentConfig() {
  const deployCue: ContractNames[] = [];
  const masterChain: ChainName = "opGoerli";
  const ethernalEnabled: boolean = false;

  return { deployCue, ethernalEnabled, masterChain };
}
