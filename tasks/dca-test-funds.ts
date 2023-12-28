/** @format */
import { task } from "hardhat/config";
import { deploymentArgumentStore } from "../deployments/deploymentModules";
import {
  ChainName,
  productionChainImpersonators,
  tokenAddress,
} from "~/bin/tokenAddress";

const taskId = "dcaFundTests";

task(taskId, "Register the DCAAccount Contract to block explorer").setAction(
  async (_args, hre) => {
    console.log(`🟢 [TASK] ${taskId} : Mounted`);

    const [owner] = await hre.ethers.getSigners();
    const network = hre.network.name as ChainName;

    const impersonateUSDC = await hre.ethers.getImpersonatedSigner(
      productionChainImpersonators.arbitrum.usdc
    );
    const usdcContract = await hre.ethers.getContractAt(
      "ERC20",
      tokenAddress.usdc[network],
      impersonateUSDC
    );
    // Transfer Funds

    const tx = await usdcContract.transfer(owner.address, 1000 * 10 ** 6);
    await tx.wait();

    console.log("Transfered USDC:", tx);
  }
);
