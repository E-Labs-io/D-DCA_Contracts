/** @format */

import { Addressable } from "ethers";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";
import { DeploymentProps } from "~/types/deployment/deploymentArguments";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy({
  hre,
  deployer,
  delayTime,
  contractName,
  constructorArguments,
  prevDeployments,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {
    const deployedContract = await hre.ethers.deployContract(
      contractName,
      constructorArguments,
      deployer
    );
    await deployedContract.waitForDeployment();
    console.log(
      `🟢 Contract Deployed : ${contractName} to ${deployedContract.target}`
    );

    const network = await hre.ethers.provider.getNetwork();
    if (network.name !== "hardhat") {
      await delay(delayTime);
      await verifyContractOnScan(
        hre.run,
        deployedContract.target,
        constructorArguments
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
