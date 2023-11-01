/** @format */

import hardhat, { ethers } from "hardhat";
import deploymentFiles, {
  DeploymentReturn,
  DeploymentStore,
  deploymentArgumentStore,
} from "./deployers/deploymentModules";
import logDeployment from "../scripts/saveDeployLog";

async function masterDeployer(deployments: string[]) {
  const [deployer] = await ethers.getSigners();
  const delayTime = 20000;
  console.log("🟠 Master Deployer: Mounted");
  console.log(`🟠 Master Deployer: Deploying ${deployments.length} Contracts`);
  console.log("🟠 Deployer Address: ", deployer.address);

  const deploymentAddresses: DeploymentStore[] = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];
    console.log("🟠 Deploying Contract: ", deployment);
    await deploymentFiles[deployment]({
      deployer,
      delayTime,
      contractName: deployment,
      constructorArguments: deploymentArgumentStore[deployment](
        deployer.address
      ),
      prevDeployments: deploymentAddresses,
    }).then(async (address: DeploymentReturn) => {
      if (address !== false) {
        logDeployment(
          deployment,
          address,
          deployer.address,
          await deployer.provider.getNetwork()
        );
        deploymentAddresses.push({
          deployment: address,
          contractName: deployment,
        });
      }
    });
  }

  console.log("🟢 Finished Deploying Contracts", deploymentAddresses);
}

masterDeployer(["DCAExecutor", "DCAAccount"]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
