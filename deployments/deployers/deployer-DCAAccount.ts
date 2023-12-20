/** @format */

import { Addressable, ZeroAddress } from "ethers";
import {
  DeploymentProps,
  DeploymentStore,
} from "../../types/deployment/deploymentArguments";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";

export default async function deploy({
  hre,
  deployer,
  delayTime,
  contractName,
  constructorArguments,
  prevDeployments,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {


    let DCAExec: DeploymentStore | undefined = prevDeployments.find(
      (x) => x.contractName === "DCAExecutor"
    );

    if (!DCAExec)
      DCAExec = {
        deployment: "0x715fa641F8c82B91ad15C0dC92ea5c32CA5DDDFC",
        contractName: "DCAExecutor",
      };
    constructorArguments[0] = DCAExec.deployment;

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
