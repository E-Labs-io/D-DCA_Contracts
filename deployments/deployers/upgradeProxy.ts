/** @format */

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deploymentArgumentStore } from "../deploymentModules";
import delay from "~/scripts/helpers/delay";
import verifyContractOnScan from "~/scripts/helpers/verifyOnScan";
import { DeploymentProps } from "~/types/deployment/deploymentArguments";

export default async function upgradeDeployedProxy({
  hre,
  deployer,
  delayTime,
  contractName,
  network,
  constructorArguments,
  prevDeployments,
}: DeploymentProps) {
  const newContractData = await hre.ethers.getContractFactory(contractName);
  const proxy = await hre.upgrades.upgradeProxy(
    prevDeployments[0].deployment,
    newContractData
  );

  await delay(delayTime);
  await verifyContractOnScan(hre.run, proxy.target);

  console.log(
    `🟢 Contract Upgraded : ${contractName} via ${proxy.target} as Proxy`
  );

  return proxy.target;
}
