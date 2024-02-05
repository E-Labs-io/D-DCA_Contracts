/** @format */

import deploymentFiles, { deploymentArgumentStore } from "./deploymentModules";
import logDeployment from "../scripts/saveDeployLog";
import {
  DeploymentReturn,
  DeploymentStore,
} from "../types/deployment/deploymentArguments";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function masterDeployer(
  hre: HardhatRuntimeEnvironment,
  deployments: string[]
) {
  const [deployer, executor] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  const delayTime = 2000;

  console.log("🟠 Master Deployer: Mounted");
  console.log(`🟠 Master Deployer: ${deployer.address}`);
  console.log(`🟠 Master Deployer: Deploying ${deployments.length} Contracts`);
  console.log("🟠 Master Deployer: Deploying to", network.name);

  const deploymentAddresses: DeploymentStore[] = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];
    console.log("🟠 Deploying Contract:", deployment);
    await deploymentFiles[deployment]({
      hre,
      deployer,
      delayTime,
      contractName: deployment,
      network,
      constructorArguments: deploymentArgumentStore[deployment](
        deployer.address,
        network.name
      ),
      prevDeployments: deploymentAddresses,
    }).then(async (address: DeploymentReturn) => {
      if (address !== false) {
        logDeployment(deployment, address, deployer.address, network);
        deploymentAddresses.push({
          deployment: address,
          contractName: deployment,
        });
      }
    });
  }

  console.log("🟢 Finished Deploying Contracts", deploymentAddresses);
}
