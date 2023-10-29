/** @format */

import hardhat, { ethers } from "hardhat";

import { Addressable } from "ethers";
import { DeploymentProps, DeploymentStore } from "./deploymentModules";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";

export default async function deploy({
  deployer,
  delayTime,
  contractName,
  constructorArguments,
  prevDeployments
}: DeploymentProps): Promise<string | Addressable | false> {
  try {
    const DCAExec: DeploymentStore | undefined = prevDeployments.find((x) => x.contractName === "DCAExecutor")
    if(!DCAExec) return false
    constructorArguments[0] = DCAExec.deployment;

    const deployedContract = await ethers.deployContract(
      contractName,
      constructorArguments,
      deployer
    );
    await deployedContract.waitForDeployment();
    console.log(
      `🟢 Contract Deployed : ${contractName} to ${deployedContract.target}`
    );

    await delay(delayTime);
    await verifyContractOnScan(deployedContract.target, constructorArguments);

    return deployedContract.target;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
    return false;
  }
}
