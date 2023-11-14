/** @format */
import { task, types } from "hardhat/config";
import { newStrat } from "../deployments/deploymentArguments/DCA.arguments";
import { ChainName, tokenAddress } from "../bin/tokenAddress";
import { AddressLike } from "ethers";

const taskId = "setup-strategy";
const taskDescription = "Approve, Fund and Setup strategy";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  const DCAAccount = "0xB13c80BB18699e88d8df14e401BD73A4Dccb0Fc2";

  console.log(`🟢 [TASK] ${taskId} : Mounted`);
  console.log(`🟢 [TASK] ${taskId} : Setting Strategy for : `, DCAAccount);
  const [owner] = await hre.ethers.getSigners();
  const network = hre.network;

  //  Verify the contract

  const usdcAddress = tokenAddress.usdc[
    network.name as ChainName
  ] as AddressLike;

  //    Approve USDC for contrtact spend
  const usdcContract = await hre.ethers.getContractAt(
    "IERC20",
    await usdcAddress,
    owner
  );
  await usdcContract.approve(DCAAccount, hre.ethers.parseUnits("100", 6));
  console.log(`🟢 [TASK] ${taskId} : Token Spend Approved`);

  // Deploy Strategy
  const DCAAccountContract = await hre.ethers.getContractAt(
    "DCAAccount",
    DCAAccount,
    owner
  );

  await DCAAccountContract.SetupStrategy(
    newStrat(DCAAccount, hre.network.name),
    0,
    false
  );
  console.log(`🟢 [TASK] ${taskId} : New strategy set up`);

  //  Fund DCAAccount
  const fund = await DCAAccountContract.FundAccount(
    usdcAddress,
    hre.ethers.parseUnits("20", 6)
  );
  await fund.wait();
  console.log(`🟢 [TASK] ${taskId} : Account Funded`);

  //  Subscribe the strategy
  const sub = await DCAAccountContract.SubscribeStrategy(0);
  await sub.wait();
  console.log(`🟢 [TASK] ${taskId} : Strategy Subscribed`);
});
