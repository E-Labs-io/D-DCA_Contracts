/** @format */
import { task } from "hardhat/config";
import { deploymentArgumentStore } from "../deployments/deployers/deploymentModules";

const taskId = "verifyDCAAccount";

task(taskId, "Register the DCAAccount Contract to block explorer").setAction(
  async (_args, hre) => {
    const DCAAccount = "0xB13c80BB18699e88d8df14e401BD73A4Dccb0Fc2";

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
