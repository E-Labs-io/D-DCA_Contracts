/** @format */

import { Addressable } from "ethers";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";
import { DeploymentProps } from "~/types/deployment/deploymentArguments";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deployProxy({
  hre,
  deployer,
  delayTime,
  contractName,
  network,
  constructorArguments,
  prevDeployments,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {
    const contract = await hre.ethers.getContractFactory(
      contractName,
      deployer,
    );
    const deployedContract = await hre.upgrades.deployProxy(
      contract,
      constructorArguments,
    );

    await deployedContract.waitForDeployment();
    console.log(
      `🟢 Contract Deployed : ${contractName} to ${deployedContract.target} as Proxy`,
    );

    if (network.name !== "hardhat") {
      await delay(delayTime);
      await verifyContractOnScan(hre.run, deployedContract.target);
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
