/** @format */

import { task } from "hardhat/config";
import UpgradeProxy from "~/deployments/deployers/upgradeProxy";

const taskId = "upgradeProxy";
const taskDescription = "Upgrade the given contract proxy";


task(taskId, taskDescription)
  .addParam("contractname", "The name of the contract to upgrade to")
  .addParam("proxyaddress", "The address of the upgradable proxy")
  .setAction(async (_args, hre) => {
    console.log(`🟠 [TASK] ${taskId} : Mounted`);

    const { contractname, proxyaddress } = _args;
    const [deployer] = await hre.ethers.getSigners();
    const network = await hre.ethers.provider.getNetwork();

    await UpgradeProxy({
      hre,
      deployer,
      contractName: contractname,
      network,
      delayTime: 40000,
      constructorArguments: [],
      prevDeployments: [
        { deployment: proxyaddress, contractName: contractname },
      ],
    });
    console.log(`🟢 [TASK] ${taskId} : Finished`);
  });
