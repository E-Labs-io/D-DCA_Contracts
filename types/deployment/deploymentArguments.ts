/** @format */
import { AddressLike, Addressable, Network } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export interface Deployment {
  [key: string]: (
    props: DeploymentProps,
  ) => Promise<string | Addressable | false>;
}

export interface ArgumentStore {
  [key: string]: (
    deployerAddress: string | Addressable,
    network: string,
  ) => any;
}

export interface DeploymentProps {
  hre: HardhatRuntimeEnvironment;
  deployer: HardhatEthersSigner;
  delayTime: number;
  contractName: string;
  network: Network;
  constructorArguments: any[];
  prevDeployments: DeploymentStore[];
  logDeployment?: (deployment: DeploymentStore) => void;
}

export type DeploymentStore = {
  deployment: string | Addressable;
  contractName: string;
};
export type DeploymentReturn = string | Addressable | false;
