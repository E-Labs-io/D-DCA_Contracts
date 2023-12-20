/** @format */
import DCAAccountDeployer from "./deployers/deployer-DCAAccount";
import GenericDeployer from "./deployers/deployer";
import ProxyDeployer from "./deployers/deployProxy";
import {
  DCAExecutorArguments,
  DCAAccountArguments,
  DCAAccountFactoryArguments,
} from "./deploymentArguments/DCA.arguments";
import {
  ArgumentStore,
  Deployment,
} from "../types/deployment/deploymentArguments";

const deploymentFiles: Deployment = {
  DCAExecutor: GenericDeployer,
  DCAAccount: DCAAccountDeployer,
  DCAFactory: DCAAccountDeployer,
};

export const deploymentArgumentStore: ArgumentStore = {
  DCAExecutor: DCAExecutorArguments,
  DCAAccount: DCAAccountArguments,
  DCAFactory: DCAAccountFactoryArguments,
};

export default deploymentFiles;
