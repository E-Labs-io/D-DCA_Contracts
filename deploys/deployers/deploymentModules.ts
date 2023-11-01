/** @format */
import { AddressLike, Addressable } from "ethers";
import DCAAccountDeployer from "./deployer-DCAAccount";
import GenericDeployer from "./deployer";
import {
  DCAExecutorArguments,
  DCAAccountArguments,
} from "../deploymentArguments/DCA.arguments";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export interface Deployment {
  [key: string]: (
    props: DeploymentProps
  ) => Promise<string | Addressable | false>;
}

export interface ArgumentStore {
  [key: string]: (deployerAddress: string | Addressable) => any;
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

const deploymentFiles: Deployment = {
  DCAExecutor: GenericDeployer,
  DCAAccount: DCAAccountDeployer,
};

export const deploymentArgumentStore: ArgumentStore = {
  DCAExecutor: DCAExecutorArguments,
  DCAAccount: DCAAccountArguments,
};

export default deploymentFiles;
