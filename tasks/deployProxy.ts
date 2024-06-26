/** @format */

import { task } from "hardhat/config";
import masterDeployer from "~/deploy/deploy";
import deployProxy from "~/deploy/deployers/deployProxy";
import { deploymentArgumentStore } from "~/deploy/deploymentModules";

const taskId = "deployProxyContract";
const taskDescription = "Deploy the given contract via a Proxy";


task(taskId, taskDescription)
  .addParam("contractname", "The name of the contract to upgrade to")
  .setAction(async (_args, hre) => {
    console.log(`🟠 [TASK] ${taskId} : Mounted`);
    const { contractname } = _args;
    const [deployer, devAccount1, devAccount2] = await hre.ethers.getSigners();
    const network = await hre.ethers.provider.getNetwork();

    const constructorArguments = deploymentArgumentStore[contractname](
      deployer.address,
      network.name,
    );
    const delayTime = 40000;

    await deployProxy({
      hre,
      deployer: deployer,
      contractName: contractname,
      network,
      delayTime,
      constructorArguments,
      prevDeployments: [],
    });

    console.log(`🟢 [TASK] ${taskId} : Finished`);
  });
