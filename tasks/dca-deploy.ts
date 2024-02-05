/** @format */

import { task, types } from "hardhat/config";
import deploymentFiles, {
  deploymentArgumentStore,
} from "../deploy/deploymentModules";
import { newStrat } from "../deploy/deploymentArguments/DCA.arguments";
import { ChainName, tokenAddress } from "../bin/tokenAddress";
import { AddressLike } from "ethers";
import deployedDCAContracts, { ContractNames } from "~/bin/deployedAddress";
import {
  DeploymentStore,
  DeploymentReturn,
} from "~/types/deployment/deploymentArguments";
import logDeployment from "~/scripts/saveDeployLog";

const taskId = "deploydca";
const taskDescription = "Deploy the fully DCA suite";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟢 [TASK] ${taskId} : Mounted`);
  const [deployer, executor] = await hre.ethers.getSigners();
  const network = hre.network;
  const netName = network.name as ChainName;

  const deploymentAddresses: DeploymentStore[] = [];
  const delayTime = 20000;

  const contractsToDeploy: ContractNames[] = [
    "DCAExecutor",
    "DCAAccount",
    "DCAFactory",
  ];

  console.log("🟠 DCA Deployer: Mounted");
  console.log(`🟠 DCA Deployer: ${deployer.address}`);
  console.log(
    `🟠 DCA Deployer: Deploying ${contractsToDeploy.length} Contracts`
  );
  console.log("🟠 DCA Deployer: Deploying to", network.name);

  //  Deploy Contracts
  try {
    for (let i = 0; i < contractsToDeploy.length; i++) {
      const deployment = contractsToDeploy[i];
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
  } catch (error) {
    console.log("Error in task deployment", error);
  }
});
