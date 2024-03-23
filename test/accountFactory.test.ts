import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import {
  DCAFactory,
  DCAAccount,
  DCAExecutor,
  DCAReinvest,
} from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";
import { DCAExecutorArguments } from "~/deploy/deploymentArguments/DCA.arguments";
import { tokenAddress } from "~/bin/tokenAddress";
import deploymentConfig from "~/bin/deployments.config";
import { resetFork } from "~/scripts/tests/forking";

describe("> DCA Account Factory Tests", () => {
  console.log("🧪 DCA Account Factory Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;

  let factoryContract: DCAFactory;
  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvest;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  before(async () => {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
    ]);
  }

  describe("💡 Deploy and State Checks", function () {
    //  Deploy the Factory
    it("🧪 Should deploy the contract", async function () {
      const factoryFactory = await ethers.getContractFactory(
        "DCAFactory",
        addressStore.deployer.signer,
      );
      factoryContract = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter![forkedChain]!,
        ZeroAddress,
      );
      await expect(
        factoryFactory.deploy(
          ZeroAddress,
          tokenAddress.swapRouter![forkedChain]!,
          ZeroAddress,
        ),
      ).to.be.fulfilled;
    });

    it("🧪 Should have the correct owner", async function () {
      const owner = await factoryContract.owner();
      expect(owner).to.equal(addressStore.deployer.address);
    });

    it("🧪 Should return the correct swap router", async function () {
      const address = await factoryContract.SWAP_ROUTER();
      expect(address).to.equal(tokenAddress.swapRouter![forkedChain]);
    });

    it("🧪 Should return the factory is active", async function () {
      const state = await factoryContract.getFactoryActiveState();
      expect(state).to.be.true;
    });

    it("🧪 Should check the Executor address is the ZeroAddress", async function () {
      const state = await factoryContract.getActiveExecutorAddress();
      expect(state).to.equal(ZeroAddress);
    });

    it("🧪 Should check the Reinvest address is the ZeroAddress", async function () {
      const state = await factoryContract.reInvestLogicContract();
      expect(state).to.equal(ZeroAddress);
    });
  });

  describe("💡 Update Library & Executor", async function () {
    it("🧪 Should deploy the library contract", async function () {
      const contractFactory = await ethers.getContractFactory(
        "DCAReinvest",
        addressStore.deployer.signer,
      );
      reinvestContract = await contractFactory.deploy(false);
      await reinvestContract.waitForDeployment();
      expect(reinvestContract.waitForDeployment()).to.be.fulfilled;
    });

    it("🧪 Should deploy the executor contract", async function () {
      // Deploy the reinvest proxy contract
      const proxyFactory = await ethers.getContractFactory(
        "DCAExecutor",
        addressStore.deployer.signer,
      );

      const deploymentArgs = DCAExecutorArguments(
        addressStore.deployer.address,
        forkedChain,
      );

      deploymentArgs[0].executionAddress = addressStore.deployer.address;
      deploymentArgs[0].computingAddress = addressStore.deployer.address;

      executorContract = await proxyFactory.deploy(
        deploymentArgs[0],
        addressStore.executorEoa.address,
      );
      await executorContract.waitForDeployment();
      expect(executorContract.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should update the Executor Address", async function () {
      const updateAddressTx = await factoryContract.updateExecutorAddress(
        executorContract.target,
      );
      await updateAddressTx.wait();
      const address = await factoryContract.getActiveExecutorAddress();
      expect(address).to.equal(executorContract.target);
    });

    it("🧪 Should update the Reinvest Address", async function () {
      const updateAddressTx =
        await factoryContract.updateReinvestLibraryAddress(
          reinvestContract.target,
        );
      await updateAddressTx.wait();
      const address = await factoryContract.reInvestLogicContract();
      expect(address).to.equal(reinvestContract.target);
    });
  });

  describe("💡 Create new account & check store", function () {
    it("🧪 Should return the user doesn't have an account", async function () {
      const userAccounts = await factoryContract.getDCAAccountsOfUser(
        addressStore.user.address,
      );
      expect(userAccounts.length).to.equal(0);
    });

    it("🧪 Should deploy a new Account", async function () {
      const createTx = await factoryContract
        .connect(addressStore.user.signer)
        .createDCAAccount();
      await expect(createTx.wait()).to.be.fulfilled;
    });

    it("🧪 Should return the user has 1 account", async function () {
      const userAccounts = await factoryContract.getDCAAccountsOfUser(
        addressStore.user.address,
      );
      expect(userAccounts.length).to.equal(1);
    });
  });

  describe("💡 Check fallbacks", function () {
    it("🧪 It should revert on ETH payment", async function () {
      await expect(
        addressStore.user.signer.sendTransaction({
          to: factoryContract.target,
          value: ethers.parseEther("0.1"),
        }),
      ).to.be.revertedWith("DCAFactory : [receive]");
    });
  });
});
