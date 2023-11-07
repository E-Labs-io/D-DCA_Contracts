/** @format */

import { task } from "hardhat/config";
import masterDeployer from "~/deployments/deploy";

const taskId = "deployContracts";
const taskDescription = "Deploy the given contracts";
const contractsToDeploy = ["DCAExecutor", "DCAAccount"];

// "DCAExecutor", "DCAAccount", "DCAAccountFactory"

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟠 [TASK] ${taskId} : Mounted`);
  await masterDeployer(hre, contractsToDeploy);
  console.log(`🟢 [TASK] ${taskId} : Finished`);
});
