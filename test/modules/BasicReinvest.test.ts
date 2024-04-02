import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { AbiCoder, Addressable, Contract, ZeroAddress } from "ethers";
import { DCAAccount, DCAExecutor, IAToken, IERC20 } from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";
import {
  DCAExecutorArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { tokenAddress } from "~/bin/tokenAddress";
import { EMPTY_STRATEGY } from "~/bin/emptyData";
import { compareStructs } from "~/scripts/tests/comparisons";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import { DCAReinvest } from "~/types/contracts";
import {
  approveErc20Spend,
  connectToErc20,
  getErc20Balance,
  getErc20ImpersonatedFunds,
  transferErc20Token,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";

describe("> Basic Reinvest Test", () => {
  console.log("🧪 DCA Reinvest Modula : Basic Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IERC20;
  let aWethContract: IAToken;
  let aaveV3Contract: Contract;

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
      "target2",
    ]);

    aWethContract = (await connectToErc20(
      tokenAddress?.aWeth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    )) as IAToken;

    usdcContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address as Addressable,
      ethers.parseUnits("10000000", 6),
      "usdc",
    );

    wethContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address as Addressable,
      ethers.parseEther("100"),
      "weth",
    );
  }

  describe("💡 Deploy Account and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the Account contract", async () => {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.user.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter![forkedChain]!,
        addressStore.user.address,
        ZeroAddress,
      );
      await createdAccount.waitForDeployment();
      createdAccount = createdAccount.connect(addressStore.user.signer);
      expect(createdAccount.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should have the correct owner", async () => {
      const owner = await createdAccount.owner();
      expect(owner).to.equal(addressStore.user.address);
    });
  });

  describe("💡 Deploy & Update Library & Executor Addresses", () => {
    it("🧪 Should deploy the library contract", async function () {
      const contractFactory = await ethers.getContractFactory(
        "DCAReinvest",
        addressStore.deployer.signer,
      );
      reinvestContract = await contractFactory.deploy(true);
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
        "eth",
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
      const updateAddressTx = await createdAccount
        .connect(addressStore.user.signer)
        .changeExecutor(executorContract.target);
      await updateAddressTx.wait();
      const address = await createdAccount.getExecutorAddress();
      expect(address).to.equal(executorContract.target);
    });

    it("🧪 Should update the Reinvest Address", async function () {
      const updateAddressTx = await createdAccount
        .connect(addressStore.user.signer)
        .changeDCAReinvestLibrary(reinvestContract.target);
      await updateAddressTx.wait();
      const address = await createdAccount.getAttachedReinvestLibraryAddress();
      expect(address).to.equal(reinvestContract.target);
    });
  });

  describe("💡 Create Strategy", () => {
    it("🧪 Should return there are no strategy's on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      expect(compareStructs(strats, EMPTY_STRATEGY)).to.be.true;
    });
    it("🧪 Should create a new Strategy & subscribe it to the executor", async function () {
      const uscUsercontract = await connectToErc20(
        tokenAddress.usdc![forkedChain] as string,
        addressStore.user.signer,
      );
      await approveErc20Spend(
        uscUsercontract,
        createdAccount.target as Addressable,
        ethers.parseUnits("100000", 6),
      ).catch((error) => console.log("approve error: ", error));

      const reinvest: IDCADataStructures.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [0x01, addressStore.target2.address, tokenAddress.weth![forkedChain]],
        ),
        active: true,
        investCode: 0x01,
        dcaAccountAddress: createdAccount.target,
      };

      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
        reinvest,
      );

      const createStratTx = await createdAccount.SetupStrategy(
        strat,
        ethers.parseUnits("10000", 6),
        true,
      );

      const success = await createStratTx
        .wait()
        .catch((error) => console.log("Create Strat wait() Error:", error));

      await expect(success)
        .to.emit(createdAccount, "NewStrategyCreated")
        .withArgs(1);
    });
    it("🧪 Should return there is strategy 1 on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      const checker = strats[0];
      expect(checker).to.equal(createdAccount.target);
    });
  });

  describe("💡 Execution", () => {
    it("🧪 Should show balance of WETH == 0 of testTarget Wallet", async () => {
      const bal = await getErc20Balance(
        wethContract,
        addressStore.target2.address,
      );

      expect(Number(bal) === 0).to.be.true;
    });
    it("🧪 Should execute strategy 1", async () => {
      const tx = await executorContract
        .connect(addressStore.executorEoa.signer)
        .Execute(createdAccount.target, 1);

      await expect(tx.wait()).to.be.fulfilled;
    });
    it("🧪 Should show balance of WETH > 0", async () => {
      const bal = await getErc20Balance(
        wethContract,
        addressStore.target2.address,
      );
      expect(Number(bal)).to.be.above(0);
    });
  });
});
