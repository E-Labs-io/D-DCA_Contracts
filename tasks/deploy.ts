/** @format */

import { task } from "hardhat/config";
import masterDeployer from "~/deployments/deploy";

const taskId = "deployContracts";
const taskDescription = "Deploy the given contracts";

// "DCAExecutor", "DCAAccount", "DCAFactory"

task(taskId, taskDescription)
  .addVariadicPositionalParam(
    "contractnames",
    "Array of contract names to deploy"
  )
  .setAction(async (_args, hre) => {
    console.log(`🟠 [TASK] ${taskId} : Mounted`);
    const { contractnames } = _args;
    await masterDeployer(hre, contractnames);
    console.log(`🟢 [TASK] ${taskId} : Finished`);
  });
