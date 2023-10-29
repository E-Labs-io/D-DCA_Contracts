/** @format */

import hardhat, { ethers } from "hardhat";
import verifyContractOnScan from "../../helpers/verifyOnScan";
import delay from "../../helpers/delay";
import { Addressable } from "ethers";

import { DeploymentProps } from "./deploymentModules";

export default async function deployer({
  deployer,
  delayTime,
  contractName,
  constructorArguments,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {

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
    console.error(`DEPLOYER : ${contractName} ERROR :`, error);
    process.exitCode = 1;
    return false;
  }
}
