/** @format */
import GenericDeployer from "./deployers/deployer";
import ProxyDeployer from "./deployers/deployProxy";
import {
  DCAExecutorArguments,
  DCAAccountArguments,
  DCAAccountFactoryArguments,
  DCAReinvestLibraryArguments,
} from "./deploymentArguments/DCA.arguments";
import {
  ArgumentStore,
  Deployment,
} from "../types/deployment/deploymentArguments";

const deploymentFiles: Deployment = {
  DCAReinvest: GenericDeployer,
  DCAExecutor: GenericDeployer,
  DCAAccount: GenericDeployer,
  DCAFactory: GenericDeployer,
  DCAReinvestProxy: ProxyDeployer,
};

export const deploymentArgumentStore: ArgumentStore = {
  DCAReinvest: DCAReinvestLibraryArguments,
  DCAReinvestProxy: DCAReinvestLibraryArguments,
  DCAExecutor: DCAExecutorArguments,
  DCAAccount: DCAAccountArguments,
  DCAFactory: DCAAccountFactoryArguments,
};

export default deploymentFiles;
