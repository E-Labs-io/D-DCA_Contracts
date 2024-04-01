import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { AbiCoder, ZeroAddress } from "ethers";
import {
  DCAAccount,
  DCAExecutor,
  IERC20,
  type DCAReinvest,
  IAToken,
} from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";
import {
  DCAExecutorArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import { EMPTY_STRATEGY, ZERO_ADDRESS } from "~/bin/emptyData";
import { compareStructs } from "~/scripts/tests/comparisons";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
  getErc20Balance,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";

describe("> DCA Executor Tests", () => {
  console.log("🧪 DCA Executor Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IERC20;

  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvest;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
      "testTarget",
    ]);

    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.usdc as string,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.usdc as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    usdcContract = await connectToErc20(
      tokenAddress?.usdc?.[forkedChain]! as string,
      usedImpersonater,
    );

    const wethImpersonator = await ethers.getImpersonatedSigner(
      productionChainImpersonators?.eth?.weth as string,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.weth as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    wethContract = await connectToErc20(
      tokenAddress?.weth?.[forkedChain]! as string,
      wethImpersonator,
    );

    const tx = await usdcContract.transfer(
      addressStore.user.address,
      ethers.parseUnits("20000", 6),
    );
    await tx.wait();
  }

  describe("💡 Deploy and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the executor contract", async () => {
      const executorFactory = await ethers.getContractFactory(
        "DCAExecutor",
        addressStore.deployer.signer,
      );
      console.log(
        "Sending Fee Data",
        DCAExecutorArguments(addressStore.deployer.address, forkedChain),
      );
      executorContract = await executorFactory.deploy(
        DCAExecutorArguments(addressStore.deployer.address, forkedChain)[0],
        addressStore.executorEoa.address,
      );
      await expect(executorContract.waitForDeployment()).to.be.fulfilled;
    });

    it("🧪 Should have the correct owner", async () => {
      const owner = await executorContract.owner();
      expect(owner).to.equal(addressStore.deployer.address);
    });

    it("🧪 Should revert trying to execute - not Executor EOA", async () => {
      await expect(
        executorContract.Execute(ZERO_ADDRESS, 1),
      ).to.be.revertedWith(
        "OnlyExecutor : [onlyExecutor] Address is not an executor",
      );
    });
    it("🧪 Return the Executor EOA address", async () => {
      const tx = await executorContract.getExecutorAddress();
      expect(tx).to.equal(addressStore.executorEoa.address);
    });
  });

  describe("💡 Test Fee Storage & Calculus", () => {
    it("🧪 Should return the current fee data struct", async () => {
      const feeData = await executorContract.getFeeData();
      console.log("Fee Data", feeData);
      expect(Number(feeData[0])).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .amountToExecutor,
      );
      expect(Number(feeData[1])).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .amountToComputing,
      );
      expect(Number(feeData[2])).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .amountToAdmin,
      );
      expect(Number(feeData[3])).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .feeAmount,
      );
      expect(feeData[4]).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .executionAddress,
      );
      expect(feeData[5]).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .computingAddress,
      );
      expect(feeData[6]).to.equal(
        DCAExecutorArguments(addressStore.deployer.signer, forkedChain)[0]
          .adminAddress,
      );
    });
    it("🧪 [DEVgetFeeQuote] Should return the correct total fee of $100 execution", async () => {
      const feeAmount = await executorContract.DEVgetFeeQuote(
        ethers.parseUnits("100", 6),
      );
      console.log("Got Fee", feeAmount);
      expect(Number(feeAmount)).to.equal(300000);
    });

    it("🧪 [DEVcalculateSplitFee] Should return 10% of 100,000,000", async () => {
      const amount = await executorContract.DEVcalculateSplitFee(
        1000,
        100000000,
      );
      expect(amount).to.equal(10000000);
    });

    it("🧪 [DEVgetFeesOfAmount] Should return the correct splits for $1000", async () => {
      const amount = await executorContract.DEVgetFeesOfAmount(
        ethers.parseUnits("1000", 6),
      );
      expect(Number(amount[0])).to.equal(300000);
    });
  });
});
