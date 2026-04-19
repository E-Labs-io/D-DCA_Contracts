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

      if (deployment === "DCAAccount" || deployment === "DCAFactory") {
        // Find DCAExecutor address from current deployment session
        const executorDeployment = deploymentAddresses.find(
          (d) => d.contractName === "DCAExecutor",
        );
        if (executorDeployment) {
          args[0] = executorDeployment.deployment;
        }

        // Set reinvest address if available
        if (reinvestAddress) {
          if (deployment === "DCAAccount") {
            args[3] = reinvestAddress;
          } else if (deployment === "DCAFactory") {
            args[2] = reinvestAddress;
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
