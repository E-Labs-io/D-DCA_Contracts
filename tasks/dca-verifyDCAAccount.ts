/** @format */
import { task } from "hardhat/config";
import { deploymentArgumentStore } from "../deployments/deployers/deploymentModules";

const taskId = "verifyDCAAccount";

task(taskId, "Register the DCAAccount Contract to block explorer").setAction(
  async (_args, hre) => {
    const DCAAccount = "0xE0B049A2E77D26135fa30ad6BCB4c6660c6C434e";

    console.log(`🟢 [TASK] ${taskId} : Mounted`);
    console.log(`🟢 [TASK] ${taskId} : Verifying Contract : `, DCAAccount);

    const [owner] = await hre.ethers.getSigners();
    const network = hre.network;

    //  Verify the contract
    await hre.run("verify:verify", {
      address: DCAAccount,
      constructorArguments: deploymentArgumentStore.DCAAccount(
        owner.address,
        network.name,
      ),
    });
  }
);
