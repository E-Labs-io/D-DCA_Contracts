import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { AbiCoder, AddressLike, ZeroAddress } from "ethers";
import { DCAAccount, IERC20 } from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";

import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";

import { ISwapRouter__factory } from "../types/contracts/factories/contracts/protocols/uniswap/ISwapRouterv3.sol";
import { ISwapRouter } from "~/types/contracts";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
} from "~/scripts/tests/contractInteraction";

import { resetFork } from "~/scripts/tests/forking";

describe("> Uniswap Tests Tests", () => {
  console.log("🧪 Uniswap Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let swapParams: ISwapRouter.ExactInputSingleParamsStruct;

  let usdcContract: IERC20;
  let wethContract: IERC20;

  let createdAccount: DCAAccount;
  let addressStore: SignerStore;
  let swapRouter: ISwapRouter;

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, ["deployer"]);

    // SWAP ROUTER
    swapRouter = (await ethers.getContractAt(
      [...ISwapRouter__factory.abi],
      tokenAddress.swapRouter![forkedChain]! as string,
      addressStore.deployer.signer,
    )) as unknown as ISwapRouter;

    // USDC
    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.usdc as string,
    );
    usdcContract = await connectToErc20(
      tokenAddress?.usdc?.[forkedChain]! as string,
      usedImpersonater,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.usdc as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    const tx = await usdcContract.transfer(
      addressStore.deployer.address,
      ethers.parseUnits("20000", 6),
    );
    await tx.wait();

    //  WETH
    wethContract = await connectToErc20(
      tokenAddress?.weth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    );

    const block = await hre.ethers.provider.getBlock("latest");
    swapParams = {
      tokenIn: tokenAddress.usdc![forkedChain]!,
      tokenOut: tokenAddress.weth![forkedChain]!,
      fee: 10000,
      recipient: addressStore.deployer.address,
      amountIn: ethers.parseUnits("1000", 6),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
  }

  describe("💡 Check balances & Allowances", () => {
    it("🧪 Should show 0 WETH balance", async () => {
      const tx = await wethContract.balanceOf(addressStore.deployer.address);
      expect(tx).to.equal(0);
    });
    it("🧪 Should return the USDC balance of account $20000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);
      const tx = await contract.balanceOf(addressStore.deployer.address);
      expect(tx).to.equal(ethers.parseUnits("20000", 6));
    });
  });

  describe("💡 Test Swap directly on Router", () => {
    it("🧪 Should return the WETH address", async () => {
      const weth9Address = await swapRouter.WETH9();
      expect(weth9Address).to.equal(tokenAddress.weth![forkedChain]);
    });

    it("🧪 Should revert a USDC > WETH trade - Not spend approved", async () => {
      await expect(swapRouter.exactInputSingle(swapParams)).to.be.revertedWith(
        "STF",
      );
    });

    it("🧪 Should approve the swaprouter to spend USDC", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract.approve(
        tokenAddress.swapRouter![forkedChain] as AddressLike,
        ethers.parseUnits("1000", 6),
      );
      await expect(tx.wait()).to.be.fulfilled;
    });

    it("🧪 Should show swapRouter allowance of $1000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract?.allowance(
        addressStore.deployer.address as AddressLike,
        tokenAddress.swapRouter![forkedChain] as AddressLike,
      );
      expect(tx).to.equal(ethers.parseUnits("1000", 6));
    });

    it("🧪 Should execute a USDC > WETH trade", async () => {
      const tx = await swapRouter.exactInputSingle(swapParams);
      await expect(tx.wait()).to.be.fulfilled;
      const bal = await wethContract.balanceOf(addressStore.deployer.address);
      expect(bal).to.greaterThanOrEqual(1);
    });
  });
});
