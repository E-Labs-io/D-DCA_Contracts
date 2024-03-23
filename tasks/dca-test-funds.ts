/** @format */
import { task } from "hardhat/config";
import { deploymentArgumentStore } from "../deploy/deploymentModules";
import {
  ChainName,
  productionChainImpersonators,
  tokenAddress,
} from "~/bin/tokenAddress";

const taskId = "dcaFundTests";

task(taskId, "Register the DCAAccount Contract to block explorer").setAction(
  async (_args, hre) => {
    console.log(`🟢 [TASK] ${taskId} : Mounted`);

    const [owner, executorEOA] = await hre.ethers.getSigners();
    const network = hre.network.name as ChainName;

    const ERC20Address = tokenAddress.usdt![network] as string;
    const ERC20Wallet = productionChainImpersonators.arbitrum!.usdt;

    const impersonateSigner = await hre.ethers.getImpersonatedSigner(
      ERC20Wallet as string,
    );

    const ERC20Contract = await hre.ethers.getContractAt(
      "IERC20",
      ERC20Address,
      impersonateSigner,
    );
    // Transfer Funds

    const topupTx = await owner.sendTransaction({
      to: ERC20Wallet,
      value: hre.ethers.parseEther("1"),
    });

    await topupTx.wait();
    console.log("Topped up the address");

    const tx = await ERC20Contract.transfer(owner.address, 1000 * 10 ** 6);
    await tx.wait();

    console.log("Transfered USDC:", tx);
  },
);
