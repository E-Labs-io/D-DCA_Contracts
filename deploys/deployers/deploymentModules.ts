/** @format */
import { AddressLike, Addressable } from "ethers";
import ChanceRandom from "./deploy-chanceRandom";
import { ChanceGameArguments } from "../deploymentArguments/Chance.arguments";
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
}
export type DeploymentReturn = string | Addressable | false;

const deploymentFiles: Deployment = {
  ChanceGame: ChanceRandom,
};

export const deploymentArgumentStore: ArgumentStore = {
  ChanceGame: ChanceGameArguments,
};

export default deploymentFiles;
