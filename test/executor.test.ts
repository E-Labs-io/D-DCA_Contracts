import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { AbiCoder, AddressLike, ZeroAddress } from "ethers";
import {
  DCAAccount,
  DCAExecutor,
  IERC20,
  type DCAReinvest,
} from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";

import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import { EMPTY_STRATEGY_OBJECT, ZERO_ADDRESS } from "~/bin/emptyData";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";
import { newStrat } from "~/deploy/deploymentArguments/DCA.arguments";

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

  let FeeData: IDCADataStructures.FeeDistributionStruct;

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
      "executorBank",
      "comptBank",
      "adminBank",
    ]);

    FeeData = {
      amountToAdmin: 2500, //  25%
      amountToComputing: 5000, //  45%
      amountToExecutor: 2500, //  25%
      feeAmount: 30, //  0.3%
      executionAddress: addressStore.executorBank.address,
      computingAddress: addressStore.comptBank.address,
      adminAddress: addressStore.adminBank.address,
    };

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
  }

  describe("💡 Deploy and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should revert to deploy the executor contract", async () => {
      const executorFactory = await ethers.getContractFactory(
        "DCAExecutor",
        addressStore.deployer.signer,
      );

      await expect(
        executorFactory.deploy(
          { ...FeeData, amountToComputing: 0 },
          addressStore.executorEoa.address,
        ),
      ).to.be.revertedWith(
        "DCAExecutor : [setFeeData] Total split percents don't equal 100%",
      );
    });
    it("🧪 Should deploy the executor contract", async () => {
      const executorFactory = await ethers.getContractFactory(
        "DCAExecutor",
        addressStore.deployer.signer,
      );
      executorContract = await executorFactory.deploy(
        FeeData,
        addressStore.executorEoa.address,
      );
      await expect(executorContract.waitForDeployment()).to.be.fulfilled;
    });

    it("🧪 Should activate the interval", async () => {
      expect(await executorContract.isIntervalActive(0)).to.be.false;
      await executorContract.setIntervalActive(0, true);
      expect(await executorContract.isIntervalActive(0)).to.be.true;
    });

    it("🧪 Should set the base token allowance", async () => {
      expect(await executorContract.isTokenAllowedAsBase(usdcContract.target))
        .to.be.false;

      await executorContract.setBaseTokenAllowance(usdcContract.target, true);
      expect(await executorContract.isTokenAllowedAsBase(usdcContract.target))
        .to.be.true;
    });

    it("🧪 Should have the correct owner", async () => {
      const owner = await executorContract.owner();
      expect(owner).to.equal(addressStore.deployer.address);
    });

    it("🧪 Should revert trying to execute - not Executor EOA", async () => {
      await expect(
        executorContract.Execute(ZERO_ADDRESS as AddressLike, 1n, 0n),
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
    it("🧪 Should revert updating fee data struct", async () => {
      expect(
        executorContract.setFeeData({ ...FeeData, amountToComputing: 0 }),
      ).to.be.revertedWith(
        "DCAExecutor : [setFeeData] Total split percents don't equal 100%",
      );
    });
    it("🧪 Should return the current fee data struct", async () => {
      const feeData = await executorContract.getFeeData();
      expect(Number(feeData[0])).to.equal(FeeData.amountToExecutor);
      expect(Number(feeData[1])).to.equal(FeeData.amountToComputing);
      expect(Number(feeData[2])).to.equal(FeeData.amountToAdmin);
      expect(Number(feeData[3])).to.equal(FeeData.feeAmount);
      expect(feeData[4]).to.equal(FeeData.executionAddress);
      expect(feeData[5]).to.equal(FeeData.computingAddress);
      expect(feeData[6]).to.equal(FeeData.adminAddress);
    });
  });

  describe("💡 Test fee receiving and distribution", () => {
    it("🧪 Should check USDC Balance of Executor to be Zero", async () => {
      expect(await usdcContract.balanceOf(executorContract.target)).to.equal(
        0n,
      );
    });
    it("🧪 Should check USDC Balance of all fee receiving EAO to be zero", async () => {
      expect(
        await usdcContract.balanceOf(addressStore.executorBank.address),
      ).to.equal(0n);
      expect(
        await usdcContract.balanceOf(addressStore.comptBank.address),
      ).to.equal(0n);
      expect(
        await usdcContract.balanceOf(addressStore.adminBank.address),
      ).to.equal(0n);
    });
    it("🧪 Should transfer USDC to the Executor", async () => {
      await expect(
        usdcContract.transfer(
          executorContract.target,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should check USDC Balance of Executor to be $100", async () => {
      expect(await usdcContract.balanceOf(executorContract.target)).to.equal(
        ethers.parseUnits("100", 6),
      );
    });
    it("🧪 Should Distribute the $100 fee", async () => {
      await expect(executorContract.DistributeFees(usdcContract.target)).to.be
        .fulfilled;
    });
    it("🧪 Should check USDC Balance of all fee receiving EAO to have there split", async () => {
      const totalFee = Number(ethers.parseUnits("100", 6));
      expect(
        await usdcContract.balanceOf(addressStore.executorBank.address),
      ).to.equal(
        calculatePercentage(Number(FeeData.amountToExecutor), totalFee),
      );
      expect(
        await usdcContract.balanceOf(addressStore.comptBank.address),
      ).to.equal(
        calculatePercentage(Number(FeeData.amountToComputing), totalFee),
      );
      expect(
        await usdcContract.balanceOf(addressStore.adminBank.address),
      ).to.equal(calculatePercentage(Number(FeeData.amountToAdmin), totalFee));
    });
    it("🧪 Should check USDC Balance of Executor to be Zero", async () => {
      expect(await usdcContract.balanceOf(executorContract.target)).to.equal(
        0n,
      );
    });
  });

  describe("💡 Check security and fallback", () => {
    it("🧪 Should revert on fallback when sending ETH", async () => {
      const message = {
        to: executorContract.target,
        value: ethers.parseEther("1"),
      };
      await expect(
        addressStore.deployer.signer.sendTransaction(message),
      ).to.be.revertedWith("DCAExecutor : [receive]");
    });

    it("🧪 Should revert to distribute fees, not admin", async () => {
      const connected = await executorContract.connect(
        addressStore.user.signer,
      );

      await expect(connected.DistributeFees(ZERO_ADDRESS)).to.be.revertedWith(
        "OnlyAdmin : [onlyAdmins] Address is not an admin",
      );
    });

    it("🧪 Should revert on Execution Try, Not Executor", async () => {
      const connected = executorContract.connect(addressStore.user.signer);

      await expect(
        connected.Execute(ZERO_ADDRESS as AddressLike, 0n, 0n),
      ).to.be.revertedWith(
        "OnlyExecutor : [onlyExecutor] Address is not an executor",
      );
    });

    it("🧪 Should revert on Subscription, Not Account Contract", async () => {
      const strat = EMPTY_STRATEGY_OBJECT;

      await expect(executorContract.Subscribe(strat)).to.be.revertedWith(
        "DCAexecutor : [Subscribe] Only Account Contract can unsubscribe",
      );
    });

    it("🧪 Should change the active stage to false", async () => {
      await expect(executorContract.setActiveState(false)).to.be.fulfilled;
    });
    it("🧪 Should revert on Execute, Not active ", async () => {
      await expect(
        executorContract.Subscribe(EMPTY_STRATEGY_OBJECT),
      ).to.be.revertedWithCustomError(executorContract, "ContractIsPaused");
    });

    it("🧪 Should revert on setBaseTokenAllowance, Not admin", async () => {
      await expect(
        executorContract
          .connect(addressStore.user.signer)
          .setBaseTokenAllowance(usdcContract.target, true),
      ).to.be.revertedWith("OnlyAdmin : [onlyAdmins] Address is not an admin");
    });

    it("🧪 Should revert on Subscription, Not allowed Base Token", async () => {
      // Set the executor contract to active
      await expect(executorContract.setActiveState(true)).to.be.fulfilled;

      // Deploy the account contract
      let accountBase = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.deployer.signer,
      );
      createdAccount = await accountBase.deploy(
        executorContract.target,
        tokenAddress.swapRouter![forkedChain]!,
        addressStore.user.address,
        ZeroAddress,
      );
      await expect(createdAccount.waitForDeployment()).to.be.fulfilled;
      createdAccount = createdAccount.connect(addressStore.user.signer);

      // Create the strategy object
      let strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
      );
      // Amend the base token to the weth token
      strat.baseToken.tokenAddress = wethContract.target;

      // Expect the strategy to be reverted with the error
      await expect(
        createdAccount.SetupStrategy(strat, 0, true),
      ).to.be.revertedWithCustomError(executorContract, "NotAllowedBaseToken");
    });

    it("🧪 Should revert on setIntervalActive, Not admin", async () => {
      await expect(
        executorContract
          .connect(addressStore.user.signer)
          .setIntervalActive(0, true),
      ).to.be.revertedWith("OnlyAdmin : [onlyAdmins] Address is not an admin");
    });

    it("🧪 Should revert on setActiveState, Not admin", async () => {
      await expect(
        executorContract
          .connect(addressStore.user.signer)
          .setActiveState(false),
      ).to.be.revertedWith("OnlyAdmin : [onlyAdmins] Address is not an admin");
    });
  });
});

function calculatePercentage(percent: number, amount: number): number {
  // Convert percent to decimal
  const percentDecimal = percent / 10000;

  // Calculate the percentage of the amount
  const percentageAmount = percentDecimal * amount;

  return percentageAmount;
}
