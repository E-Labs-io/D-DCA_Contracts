/** @format */

import hardhat, { ethers } from "hardhat";
import deploymentFiles, {
  deploymentArgumentStore,
} from "./deployers/deploymentModules";
import logDeployment from "../scripts/saveDeployLog";
import {
  DeploymentReturn,
  DeploymentStore,
} from "../types/deployment/deploymentArguments";

async function masterDeployer(deployments: string[]) {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  const delayTime = 35000;

  console.log("🟠 Master Deployer: Mounted");
  console.log("🟠 Master Deployer: ", deployer.address);
  console.log(`🟠 Master Deployer: Deploying ${deployments.length} Contracts`);
  console.log("🟠 Master Deployer: Deploying to : ", network.name);

  const deploymentAddresses: DeploymentStore[] = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];
    console.log("🟠 Deploying Contract: ", deployment);
    await deploymentFiles[deployment]({
      deployer,
      delayTime,
      contractName: deployment,
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

masterDeployer(["DCAAccountFactory"]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// "DCAExecutor",
