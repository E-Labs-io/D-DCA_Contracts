/** @format */

import { task } from "hardhat/config";
import masterDeployer from "~/deployments/deploy";
import deployProxy from "~/deployments/deployers/deployProxy";
import { deploymentArgumentStore } from "~/deployments/deploymentModules";

const taskId = "deployProxyContract";
const taskDescription = "Deploy the given contract via a Proxy";

// "DCAExecutor", "DCAAccount", "DCAAccountFactory"

task(taskId, taskDescription)
  .addParam("contractname", "The name of the contract to upgrade to")
  .setAction(async (_args, hre) => {
    console.log(`🟠 [TASK] ${taskId} : Mounted`);
    const { contractname } = _args;
    const [deployer] = await hre.ethers.getSigners();
    const network = await hre.ethers.provider.getNetwork();

    const constructorArguments = deploymentArgumentStore[contractname](
      deployer.address,
      network.name
    );
    const delayTime = 40000;

    await deployProxy({
      hre,
      deployer,
      contractName: contractname,
      network,
      delayTime,
      constructorArguments,
      prevDeployments: [],
    });

    console.log(`🟢 [TASK] ${taskId} : Finished`);
  });
