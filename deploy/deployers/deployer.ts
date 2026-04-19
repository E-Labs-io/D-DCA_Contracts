/** @format */

import { Addressable } from "ethers";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";
import { DeploymentProps } from "~/types/deployment/deploymentArguments";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import waitForConfirmations from "~/scripts/helpers/waitForConformations";

export default async function deploy({
  hre,
  deployer,
  delayTime,
  contractName,
  network,
  constructorArguments,
  prevDeployments,
  logDeployment,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {
    const deployedContract = await hre.ethers.deployContract(
      contractName,
      constructorArguments,
      deployer,
    );
    console.log(
      `🟠 Deployment confirming : ${contractName} to ${deployedContract.target}`,
    );

    await deployedContract.waitForDeployment();

    console.log(`🟠 Deployment Confirmed CHECK: ${contractName}`);
    if (logDeployment) {
      console.log(">>>>>>>> Calling logDeployment function");
      logDeployment({
        deployment: deployedContract.target,
        contractName,
      });
    }

    if (network.name !== "localhost" && network.name !== "hardhat")
      await waitForConfirmations(
        hre,
        deployedContract.deploymentTransaction()?.hash!,
        2,
      );

    console.log(
      `🟢 Contract Deployed : ${contractName} to ${deployedContract.target}`,
    );

    if (network.name !== "hardhat") {
      await delay(delayTime);
      await verifyContractOnScan(
        hre.run,
        deployedContract.target,
        constructorArguments,
      );
    } else {
      await hre.ethernal.push({
        name: contractName,
        address: deployedContract.target as string,
        workspace: "hardhat",
      });
    }

    return deployedContract.target;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
    return false;
  }
}
