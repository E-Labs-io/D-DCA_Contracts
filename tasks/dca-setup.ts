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

  let DCAAccount: string = "0x00AC89dbd36308ce0d5a4FDb77A78386b48E013A";

  const [deployAccount, approveFund, fundAccount, newStrategy, subscribeStrat] =
    [true, true, true, true, true];

  if (deployAccount) {
    console.log(`🟡 [TASK] ${taskId} : Creating Account from factory`);

    const DCAFactory = await hre.ethers.getContractAt(
      "DCAFactory",
      deployedDCAContracts[network.name as ChainName]!.DCAFactory!,
      owner
    );

    const tx = await DCAFactory.createDCAAccount();
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    const checkArgs: any[] = receipt?.logs.find(
      (eventLog) => eventLog?.fragment?.name == "DCAAccountCreated"
    )!.args!;

    if (checkArgs && checkArgs[0] === owner.address) {
      DCAAccount = checkArgs[1];
      console.log(
        `🟢 [TASK] ${taskId} : Created new DCAAccount : `,
        DCAAccount
      );
    } else
      console.log(`🔴 [TASK] ${taskId} : Failed to Created new DCAAccount `);
  }

  //  Get the Account contract
  console.log(`🟡 [TASK] ${taskId} : Connecting to Account`);
  const DCAAccountContract = await hre.ethers.getContractAt(
    "DCAAccount",
    DCAAccount,
    owner
  );

  //  Get the USDC contract address for given network
  const usdcAddress = tokenAddress.usdc[
    network.name as ChainName
  ] as AddressLike;

  if (approveFund) {
    //    Approve USDC for contrtact spend
    console.log(`🟡 [TASK] ${taskId} : Approving Account to spend USDC`);
    const usdcContract = await hre.ethers.getContractAt(
      "IERC20",
      await usdcAddress,
      owner
    );
    const tx = await usdcContract.approve(
      DCAAccount,
      hre.ethers.parseUnits("50000", 6)
    );
    await tx.wait();
    console.log(`🟢 [TASK] ${taskId} : Token Spend Approved`);
  }

  const id = 1;
  const strat = newStrat(DCAAccount, hre.network.name);

  if (newStrategy) {
    console.log(`🟡 [TASK] ${taskId} : Setting up new Strategy`);
    const tx = await DCAAccountContract.SetupStrategy(strat, 0, false);
    await tx.wait();
    console.log(`🟢 [TASK] ${taskId} : New strategy set up`);
  }

  if (fundAccount) {
    //  Fund DCAAccount
    console.log(`🟡 [TASK] ${taskId} : Funding Account`);

    const tx = await DCAAccountContract.FundAccount(
      usdcAddress,
      hre.ethers.parseUnits("1000", 6)
    );
    await tx.wait();
    console.log(`🟢 [TASK] ${taskId} : Account Funded`);
  }

  if (subscribeStrat) {
    //  Subscribe the strategy
    console.log(`🟡 [TASK] ${taskId} : Subscribing Strategy`);

    const tx = await DCAAccountContract.SubscribeStrategy(
      newStrategy ? strat.strategyId : id
    );
    await tx.wait();
    console.log(`🟢 [TASK] ${taskId} : Strategy Subscribed`);
  }
  console.log(`🟢 [TASK] ${taskId} : Complete`);
});
