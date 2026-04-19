/** @format */

import { Addressable, ZeroAddress } from "ethers";
import {
  DeploymentProps,
  DeploymentStore,
} from "../../types/deployment/deploymentArguments";
import delay from "../../scripts/helpers/delay";
import verifyContractOnScan from "../../scripts/helpers/verifyOnScan";
import deployedDCAContracts from "~/bin/deployedAddress";
import { ChainName } from "~/bin/tokenAddress";

export default async function deploy({
  hre,
  deployer,
  delayTime,
  contractName,
  network,
  constructorArguments,
  prevDeployments,
}: DeploymentProps): Promise<string | Addressable | false> {
  try {
    let DCAExec: DeploymentStore | undefined = {
      deployment: deployedDCAContracts[network.name as ChainName]!.DCAExecutor!,
      contractName: "DCAExecutor",
    };

    if (!DCAExec) {
      prevDeployments.find((x) => x.contractName === "DCAExecutor");
    }
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
