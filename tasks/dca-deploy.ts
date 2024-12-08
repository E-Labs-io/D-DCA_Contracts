/** @format */

import { task } from "hardhat/config";
import deploymentFiles, {
  deploymentArgumentStore,
} from "../deploy/deploymentModules";
import { ChainName } from "../bin/tokenAddress";
import { ContractNames } from "~/bin/deployedAddress";
import {
  DeploymentStore,
  DeploymentReturn,
} from "~/types/deployment/deploymentArguments";
import logDeployment from "~/scripts/saveDeployLog";

const taskId = "deploydca";
const taskDescription = "Deploy the full DCA suite";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟢 [TASK] ${taskId} : Mounted`);
  const [deployer, a, b, executor] = await hre.ethers.getSigners();
  const network = hre.network;
  const netName = network.name as ChainName;

  const deploymentAddresses: DeploymentStore[] = [];
  const delayTime = 20000;

  let reinvestAddress;

  const contractsToDeploy: ContractNames[] = [
    "DCAReinvest",
    "DCAExecutor",
    "DCAAccount",
    "DCAFactory",
  ];

  const logDeploy = (deployment: DeploymentStore) => {
    console.log("Saving deployment:", deployment);
    deploymentAddresses.push(deployment);
    if (deployment.contractName === "DCAReinvest")
      reinvestAddress = deployment.deployment;
  };

  console.log("🟠 DCA Deployer: Mounted");
  console.log(`🟠 DCA Deployer: ${deployer.address}`);
  console.log(
    `🟠 DCA Deployer: Deploying ${contractsToDeploy.length} Contracts`,
  );
  console.log("🟠 DCA Deployer: Deploying to", netName);

  //  Deploy Contracts
  try {
    for (let i = 0; i < contractsToDeploy.length; i++) {
      const deployment = contractsToDeploy[i];
      console.log("🟠 Deploying Contract:", deployment);

      const args = deploymentArgumentStore[deployment](
        deployer.address,
        network.name,
      );

      if (contractsToDeploy[0] === "DCAReinvest")
        if (deployment === "DCAAccount") args[3] = reinvestAddress;
        else if (deployment === "DCAFactory") args[2] = reinvestAddress;

      if (contractsToDeploy[0] === "DCAExecutor")
        if (deployment === "DCAAccount" || deployment === "DCAFactory")
          args[0] = deploymentAddresses[0].deployment;
      if (contractsToDeploy[1] === "DCAExecutor")
        if (deployment === "DCAAccount" || deployment === "DCAFactory")
          args[0] = deploymentAddresses[1].deployment;

      await deploymentFiles[deployment]({
        hre,
        deployer,
        delayTime,
        contractName: deployment,
        network: network,
        constructorArguments: args,
        prevDeployments: deploymentAddresses,
        logDeployment: logDeploy,
      }).then(async (address: DeploymentReturn) => {
        if (address !== false) {
          logDeployment(deployment, address, deployer.address, network);
        }
      });
    }

    console.log("🟢 Finished Deploying Contracts", deploymentAddresses);
  } catch (error) {
    console.log("Error in task deployment", error);
  }
});
