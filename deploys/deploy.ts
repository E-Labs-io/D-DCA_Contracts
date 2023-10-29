/** @format */

import hardhat, { ethers } from "hardhat";
import deploymentFiles, {
  DeploymentReturn,
  deploymentArgumentStore,
} from "./deployers/deploymentModules";
import { Addressable } from "ethers";
import logDeployment from "../scripts/saveDeployLog";

async function masterDeployer(deployments: string[]) {
  const [deployer] = await ethers.getSigners();
  const delayTime = 20000;
  console.log("🟠 Master Deployer: Mounted");
  console.log(`🟠 Master Deployer: Deploying ${deployments.length} Contracts`);
  console.log("🟠 Deployer Address: ", deployer.address);

  const deploymentAddresses: { [deployment: string]: string | Addressable }[] =
    [];

  await deployments.forEach(async (deployment) => {
    console.log("🟠 Deploying Contract: ", deployment);
    await deploymentFiles[deployment]({
      deployer,
      delayTime,
      contractName: deployment,
      constructorArguments: deploymentArgumentStore[deployment](
        deployer.address
      ),
    }).then(async (address: DeploymentReturn) => {
      if (address !== false) {
        await logDeployment(
          deployment,
          address,
          deployer.address,
          await deployer.provider.getNetwork()
        );
        deploymentAddresses.push({ deployment: address });
      }
    });
  });

  console.log("🟢 Finished Deploying Contracts", deploymentAddresses);
}

masterDeployer(["ChanceGame"]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
