import { task } from "hardhat/config";

task("verify-tenderly", "Verifies contracts on Tenderly only when explicitly called")
  .addParam("address", "The contract's address")
  .setAction(async (taskArgs, hre) => {
    if (!taskArgs.address) {
      throw new Error("Contract address is required");
    }

    console.log(`Verifying contract at ${taskArgs.address} on Tenderly...`);
    
    await hre.tenderly.verify({
      address: taskArgs.address,
    });
    
    console.log("Verification complete");
  }); 