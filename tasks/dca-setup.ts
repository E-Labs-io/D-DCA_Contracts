/** @format */
import { task, types } from "hardhat/config";
import { newStrat } from "../deployments/deploymentArguments/DCA.arguments";
import { ChainName, tokenAddress } from "../bin/tokenAddress";
import { AddressLike } from "ethers";
import deployedDCAContracts from "~/bin/deployedAddress";

const taskId = "setup-strategy";
const taskDescription = "Approve, Fund and Setup strategy";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟢 [TASK] ${taskId} : Mounted`);
  const [owner] = await hre.ethers.getSigners();
  const network = hre.network;

  console.log(`🟡 [TASK] ${taskId} : Creating Account from factory`);

  const DCAFactory = await hre.ethers.getContractAt(
    "DCAFactory",
    deployedDCAContracts[network.name as ChainName]!.DCAFactory!,
    owner
  );

  const tx = await DCAFactory.createDCAAccount();
  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  const DCAAccount: string = receipt?.logs.find(
    (eventLog) => eventLog!.fragment!.name == "DCAAccountCreated"
  ).args[1]!;

  console.log(`🟢 [TASK] ${taskId} : Created new DCAAccount : `, DCAAccount);
  console.log(`🟡 [TASK] ${taskId} : Setting Strategy`);
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
  await usdcContract.approve(DCAAccount, hre.ethers.parseUnits("50000", 6));
  console.log(`🟢 [TASK] ${taskId} : Token Spend Approved`);

  // Deploy Strategy
  const DCAAccountContract = await hre.ethers.getContractAt(
    "DCAAccount",
    DCAAccount,
    owner
  );
  const go = true;
  const id = 1;
  const strat = newStrat(DCAAccount, hre.network.name);

  if (go) {
    await DCAAccountContract.SetupStrategy(strat, 0, false);
    console.log(`🟢 [TASK] ${taskId} : New strategy set up`);
  }

  //  Fund DCAAccount
  const fund = await DCAAccountContract.FundAccount(
    usdcAddress,
    hre.ethers.parseUnits("1000", 6)
  );
  await fund.wait();
  console.log(`🟢 [TASK] ${taskId} : Account Funded`);

  //  Subscribe the strategy
  const sub = await DCAAccountContract.SubscribeStrategy(
    go ? strat.strategyId : id
  );
  await sub.wait();
  console.log(`🟢 [TASK] ${taskId} : Strategy Subscribed`);
});
