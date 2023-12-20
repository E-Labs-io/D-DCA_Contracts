/** @format */
import DCAAccountDeployer from "./deployer-DCAAccount";
import GenericDeployer from "./deployer";
import {
  DCAExecutorArguments,
  DCAAccountArguments,
  DCAAccountFactoryArguments,
} from "../deploymentArguments/DCA.arguments";
import {
  ArgumentStore,
  Deployment,
} from "../../types/deployment/deploymentArguments";

const deploymentFiles: Deployment = {
  DCAExecutor: GenericDeployer,
  DCAAccount: GenericDeployer,
  DCAFactory: GenericDeployer,
};

export const deploymentArgumentStore: ArgumentStore = {
  DCAExecutor: DCAExecutorArguments,
  DCAAccount: DCAAccountArguments,
  DCAFactory: DCAAccountFactoryArguments,
};

export default deploymentFiles;
