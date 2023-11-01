/** @format */
import { task, types } from "hardhat/config";
import { newStrat } from "../deploys/deploymentArguments/DCA.arguments";

const taskId = "setup-strategy";

task(taskId, "Approve, Fund and Setup strategy").setAction(
  async (_args, hre) => {
    console.log(`🟢 [TASK] ${taskId} : Mounted`);
    const [owner] = await hre.ethers.getSigners();

    const DCAAccount = "0xA6d362c04CFb1A4867366DB9800F011Cd26d57F2";
    const usdcAddress = "0xd513E4537510C75E24f941f159B7CAFA74E7B3B9";

    //    Approve USDC for contrtact spend
    const usdcContract = await hre.ethers.getContractAt(
      "IERC20",
      usdcAddress,
      owner
    );
    await usdcContract.approve(DCAAccount, hre.ethers.parseUnits("100", 6));
    console.log("🟢 USDC spend approved");

    // Deploy Strategy
    const DCAAccountContract = await hre.ethers.getContractAt(
      "DCAAccount",
      DCAAccount,
      owner
    );
    await DCAAccountContract.SetupStrategy(newStrat, 0, false);
    console.log("🟢 New strategy set up");

    //  Fund DCAAccount
    await DCAAccountContract.FundAccount(
      usdcAddress,
      hre.ethers.parseUnits("20", 6)
    );
    console.log("🟢 Account funded with USDC");

    //  Subscribe the strategy
    await DCAAccountContract.SubscribeStrategy(0);
    console.log("🟢 Strategy Subscribed");
  }
);
