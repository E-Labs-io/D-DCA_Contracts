import { task } from "hardhat/config";
import deploymentFiles, {
  deploymentArgumentStore,
} from "../deploy/deploymentModules";
import { ChainName } from "../bin/tokenAddress";
import { ContractNames } from "~/bin/deployedAddress";
import {
  DeploymentStore,
  DeploymentReturn,
} from "~/types/deployment/deploymentArguments";
import logDeployment from "~/scripts/saveDeployLog";
import { getLedgerSigner } from "~/scripts/ledgerProvider";

const taskId = "deploydca";
const taskDescription = "Deploy the full DCA suite";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟢 [TASK] ${taskId} : Mounted`);

  // Get Hardhat network info
  const network = await hre.ethers.provider.getNetwork();
  const networkUrl = (hre.network.config as any).url;
  console.log("🟠 Network Config:", networkUrl);
  const netName = network.name as ChainName;

  // Get Ledger deployer — use the provider from HRE config
  const { signer: deployer } = await getLedgerSigner(
    networkUrl,
    2, // wallet index
    "ledgerlive", // derivation mode
  );

  const deploymentAddresses: DeploymentStore[] = [];
  const delayTime = 20000;

  let reinvestAddress;

  const contractsToDeploy: ContractNames[] = [
    "DCAReinvest",
    "DCAExecutor",
    "DCAAccount",
    "DCAFactory",
  ];

  const logDeploy = (deployment: DeploymentStore) => {
    console.log("Saving deployment:", deployment);
    deploymentAddresses.push(deployment);
    if (deployment.contractName === "DCAReinvest") {
      reinvestAddress = deployment.deployment;
    }
  };

  console.log("🟠 DCA Deployer: Mounted");
  console.log(`🟠 DCA Deployer: ${await deployer.getAddress()}`);
  console.log(
    `🟠 DCA Deployer: Deploying ${contractsToDeploy.length} Contracts`,
  );
  console.log("🟠 DCA Deployer: Deploying to", netName);

  try {
    for (let i = 0; i < contractsToDeploy.length; i++) {
      const deployment = contractsToDeploy[i];
      console.log("🟠 Deploying Contract:", deployment);

      const args = deploymentArgumentStore[deployment](
        await deployer.getAddress(),
        network.name,
      );

      // In-session wiring: overwrite the zero-address placeholders the
      // argument builders emit when bin/deployedAddress.ts has no entry
      // for this chain. Slot indices MUST match the constructors:
      //   DCAAccount  (executor, swapRouter, quoter, owner, reinvestLib)
      //   DCAFactory  (executor, swapRouter, quoter, reinvestLib)
      // A previous version of this task wrote reinvest into args[3]/
      // args[2] — overwriting the account OWNER and the factory QUOTER
      // respectively — which would have shipped a factory whose every
      // account had the reinvest library as its quoter. The patch
      // helper asserts the target slot holds the zero placeholder so a
      // future constructor reorder fails the deploy loudly instead of
      // silently corrupting it.
      const ZERO = "0x0000000000000000000000000000000000000000";
      const patchArg = (index: number, value: string, label: string) => {
        if (args[index] !== ZERO) {
          throw new Error(
            `deploydca: refusing to overwrite ${deployment} constructor arg[${index}] (${label}) — ` +
              `expected zero-address placeholder, found ${args[index]}. ` +
              `Constructor order may have changed; fix the indices in tasks/dca-deploy.ts.`,
          );
        }
        args[index] = value;
      };

      if (deployment === "DCAAccount" || deployment === "DCAFactory") {
        // Find DCAExecutor address from current deployment session
        const executorDeployment = deploymentAddresses.find(
          (d) => d.contractName === "DCAExecutor",
        );
        if (executorDeployment) {
          patchArg(0, executorDeployment.deployment as string, "executor");
        }

        // Set reinvest address if available
        if (reinvestAddress) {
          if (deployment === "DCAAccount") {
            patchArg(4, reinvestAddress, "reinvestLibrary");
          } else if (deployment === "DCAFactory") {
            patchArg(3, reinvestAddress, "reinvestLibrary");
          }
        }
      }

      await deploymentFiles[deployment]({
        hre,
        deployer: deployer as any,
        delayTime,
        contractName: deployment,
        network: network as any,
        constructorArguments: args,
        prevDeployments: deploymentAddresses,
        logDeployment: logDeploy,
      }).then(async (address: DeploymentReturn) => {
        if (address !== false) {
          logDeployment(
            deployment,
            address,
            await deployer.getAddress(),
            network as any,
          );
        }
      });
    }

    console.log("🟢 Finished Deploying Contracts", deploymentAddresses);
  } catch (error) {
    console.log("❌ Error in task deployment", error);
  }
});
