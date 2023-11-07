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
  DCAAccount: DCAAccountDeployer,
  DCAAccountFactory: DCAAccountDeployer,
};

export const deploymentArgumentStore: ArgumentStore = {
  DCAExecutor: DCAExecutorArguments,
  DCAAccount: DCAAccountArguments,
  DCAAccountFactory: DCAAccountFactoryArguments,
};

export default deploymentFiles;
