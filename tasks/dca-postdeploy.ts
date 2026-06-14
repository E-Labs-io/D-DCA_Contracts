/** @format */
import { task, types } from "hardhat/config";
import { ChainName, tokenAddress } from "../bin/tokenAddress";
import deployedDCAContracts from "~/bin/deployedAddress";

const taskId = "dca-postdeploy";
const taskDescription =
  "Post-deploy executor setup: allow base tokens, activate intervals, verify wiring. " +
  "Without this step NO strategy can subscribe (Subscribe reverts " +
  "NotAllowedBaseToken / IntervalNotActive).";

/**
 * Intervals to activate per environment.
 * Indices into the Interval enum:
 *   0 TestIntervalOneMin (dev only)
 *   1 TestIntervalFiveMins (dev only)
 *   2 OneDay | 3 TwoDays | 4 ThreeDays | 5 OneWeek | 6 TwoWeeks | 7 OneMonth
 */
const PRODUCTION_INTERVALS = [2, 3, 4, 5, 6, 7];
const DEV_INTERVALS = [0, 1, 2, 3, 4, 5, 6, 7];

task(taskId, taskDescription)
  .addOptionalParam(
    "executor",
    "DCAExecutor address (defaults to bin/deployedAddress.ts entry for this network)",
    undefined,
    types.string,
  )
  .addFlag(
    "dev",
    "Also activate the 1-min and 5-min test intervals (testnets only)",
  )
  .setAction(async (args, hre) => {
    console.log(`🟢 [TASK] ${taskId} : Mounted`);
    const netName = hre.network.name as ChainName;
    const [signer] = await hre.ethers.getSigners();

    // --- Resolve the executor address -------------------------------
    const executorAddress: string | undefined =
      args.executor || deployedDCAContracts[netName]?.DCAExecutor;
    if (!executorAddress) {
      throw new Error(
        `${taskId}: no DCAExecutor address for network "${netName}". ` +
          `Pass --executor 0x… or add the deployment to bin/deployedAddress.ts.`,
      );
    }

    const executor = await hre.ethers.getContractAt(
      "DCAExecutor",
      executorAddress,
      signer,
    );
    console.log(`🟠 [TASK] ${taskId} : Executor at ${executorAddress}`);
    console.log(`🟠 [TASK] ${taskId} : Signer ${await signer.getAddress()}`);

    // --- 1. Allow base tokens ---------------------------------------
    // USDC is the launch base token. Add more entries here as the
    // protocol expands its allowed-base list.
    const baseTokens: Array<{ label: string; address: string | undefined }> = [
      { label: "USDC", address: tokenAddress.usdc?.[netName] as string },
    ];

    for (const { label, address } of baseTokens) {
      if (!address) {
        console.log(
          `🔴 [TASK] ${taskId} : No ${label} address for ${netName} — skipping`,
        );
        continue;
      }
      const already = await executor.isTokenAllowedAsBase(address);
      if (already) {
        console.log(`🟢 [TASK] ${taskId} : ${label} already allowed`);
        continue;
      }
      const tx = await executor.setBaseTokenAllowance(address, true);
      await tx.wait();
      console.log(`🟢 [TASK] ${taskId} : ${label} allowed as base (${address})`);
    }

    // --- 2. Activate intervals --------------------------------------
    const intervals = args.dev ? DEV_INTERVALS : PRODUCTION_INTERVALS;
    if (args.dev) {
      console.log(
        `🟠 [TASK] ${taskId} : --dev flag set — activating 1-min/5-min test intervals. NEVER use on mainnet.`,
      );
    }
    for (const interval of intervals) {
      const active = await executor.isIntervalActive(interval);
      if (active) {
        console.log(`🟢 [TASK] ${taskId} : Interval ${interval} already active`);
        continue;
      }
      const tx = await executor.setIntervalActive(interval, true);
      await tx.wait();
      console.log(`🟢 [TASK] ${taskId} : Interval ${interval} activated`);
    }

    // --- 3. Verify wiring -------------------------------------------
    const registeredEOA = await executor.getExecutorAddress();
    const feeData = await executor.getFeeData();

    console.log("");
    console.log(`🟢 [TASK] ${taskId} : Post-deploy verification`);
    console.log(`   Executor EOA registered : ${registeredEOA}`);
    console.log(`   feeAmount (bps)         : ${feeData.feeAmount}`);
    console.log(
      `   fee split (exec/comp/admin): ${feeData.amountToExecutor}/${feeData.amountToComputing}/${feeData.amountToAdmin}`,
    );
    console.log(`   executionAddress        : ${feeData.executionAddress}`);
    console.log(`   computingAddress        : ${feeData.computingAddress}`);
    console.log(`   adminAddress            : ${feeData.adminAddress}`);
    console.log("");
    console.log(
      `   ⚠️  Confirm the executor EOA above matches the off-chain worker's derived wallet`,
    );
    console.log(
      `   ⚠️  Confirm executionAddress/computingAddress are production-controlled keys`,
    );

    console.log(`🟢 [TASK] ${taskId} : Complete`);
  });
