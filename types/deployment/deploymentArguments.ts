/** @format */
import { AddressLike, Addressable } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export interface Deployment {
  [key: string]: (
    props: DeploymentProps
  ) => Promise<string | Addressable | false>;
}

export interface ArgumentStore {
  [key: string]: (
    deployerAddress: string | Addressable,
    network: string
  ) => any;
}

export interface DeploymentProps {
  deployer: HardhatEthersSigner;
  delayTime: number;
  contractName: string;
  constructorArguments: any[];
  prevDeployments: DeploymentStore[];
}

export type DeploymentStore = {
  deployment: string | Addressable;
  contractName: string;
};
export type DeploymentReturn = string | Addressable | false;
