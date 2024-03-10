import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import {
  AbiCoder,
  AddressLike,
  Addressable,
  Contract,
  Signer,
  ZeroAddress,
} from "ethers";
import {
  DCAFactory,
  DCAAccount,
  DCAReinvestProxy,
  ForwardReinvest,
  DCAExecutor,
  IERC20,
} from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";
import {
  DCAAccountFactoryArguments,
  DCAExecutorArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import { EMPTY_STRATEGY } from "~/bin/emptyData";
import { compareStructs } from "~/scripts/tests/comparisons";
import { erc20 } from "~/types/contracts/@openzeppelin/contracts/token";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import type { AaveIPool, DCAReinvest } from "~/types/contracts";
import {
  approveErc20Spend,
  connectToErc20,
  getErc20Balance,
  getErc20ImpersonatedFunds,
  transferErc20Token,
} from "~/scripts/tests/contractInteraction";
import { table } from "console";

describe("> Aave V3 Reinvest Test", () => {
  console.log("🧪 DCA Account Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: Contract;
  let wethContract: Contract;
  let aWethContract: Contract;
  let aaveV3Contract: Contract;

  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvest;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  before(async function () {
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
      "testTarget",
    ]);

    aWethContract = await connectToErc20(
      tokenAddress?.aWeth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    );

    usdcContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address,
      ethers.parseUnits("100000", 6),
      "usdc",
    );

    wethContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address,
      ethers.parseEther("10"),
      "weth",
    );

    aaveV3Contract = await ethers.getContractAt(
      "AaveIPool",
      tokenAddress.aaveV3Pool![forkedChain] as string,
      addressStore.user.signer,
    );

    const bal5 = await getErc20Balance(
      aWethContract,
      addressStore.user.address,
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
        createdAccount.target as string,
        ethers.parseUnits("1000", 6),
      ).catch((error) => console.log("approve error: ", error));

      const reinvest: DCAReinvest.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [
            0x12,
            tokenAddress.weth![forkedChain],
            tokenAddress.aWeth![forkedChain],
          ],
        ),
        active: true,
        investCode: 0x12,
        dcaAccountAddress: createdAccount.target,
      };

      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
        reinvest,
      );

      const createStratTx = await createdAccount.SetupStrategy(
        strat,
        ethers.parseUnits("1000", 6),
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

  describe("💡 Supply & Withdraw directly from Aave Contract (Weth)", () => {
    it("🧪 Supply Weth to Aave", async () => {
      const connectedContract = wethContract.connect(addressStore.user.signer);
      const approveTx = await connectedContract.approve(
        tokenAddress.aaveV3Pool![forkedChain],
        ethers.parseEther("1"),
      );
      await approveTx.wait();

      const tx = await aaveV3Contract.supply(
        tokenAddress.weth![forkedChain],
        ethers.parseEther("1"),
        addressStore.user.address,
        0,
      );

      await expect(tx.wait()).to.be.fulfilled;
    });
    it("🧪 Should Withdraw aWeth from Aave", async () => {
      const bal1 = await getErc20Balance(
        aWethContract,
        addressStore.user.address,
      );

      const tx = await aaveV3Contract.withdraw(
        tokenAddress.weth![forkedChain],
        ethers.parseEther("1"),
        addressStore.user.address,
      );

      await expect(tx.wait()).to.be.fulfilled;
      const bal2 = await getErc20Balance(
        aWethContract,
        addressStore.user.address,
      );

      expect(bal2 < bal1).to.be.true;
    });
  });

  describe("💡 Execution", () => {
    it("🧪 Should show balance of aWETH == 0", async () => {
      const bal = await getErc20Balance(aWethContract, createdAccount.target);
      expect(Number(bal) === 0).to.be.true;
    });
    it("🧪 Should test the reinvest (0x12) and emit an event", async () => {
      await transferErc20Token(
        wethContract,
        createdAccount.target,
        ethers.parseEther("1"),
      );

      const notactiveStrat = [
        0x12,
        tokenAddress.weth![forkedChain],
        tokenAddress.aWeth![forkedChain],
      ];

      const reinvest: DCAReinvestLogic.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          notactiveStrat,
        ),
        active: true,
        investCode: 0x12,
        dcaAccountAddress: createdAccount.target,
      };

      const reinvestTx = await createdAccount.testReinvest(
        1,
        reinvest,
        ethers.parseEther("1"),
      );

      const recipt = await reinvestTx.wait();

      expect(recipt)
        .to.emit(createdAccount, "StrategyReinvestExecuted")
        .withArgs(1, true);
    });
    it("🧪 Should execute strategy 1", async () => {
      console.log(`
        account     :       ${createdAccount.target}
        executor    :       ${executorContract.target}
        reinvest    :       ${reinvestContract.target}
        executorEoa :       ${addressStore.executorEoa.address}
        deployer    :       ${addressStore.deployer.address}
        user        :       ${addressStore.user.address}
      `);
      const tx = await executorContract
        .connect(addressStore.executorEoa.signer)
        .Execute(createdAccount.target, 1);

      const recipt = await tx.wait();

      expect(recipt)
        .to.emit(createdAccount, "StrategyReinvestExecuted")
        .withArgs(1, true);
      //console.log("Getting strat Tx data:", recipt?.logs);
      expect(recipt).to.emit(createdAccount, "StrategyExecuted");
    });
    it("🧪 Should show balance of aWETH > 0", async () => {
      const bal1 = await getErc20Balance(aWethContract, createdAccount.target);
      expect(Number(bal1) > 0).to.be.true;
    });
  });

  describe("💡 Unwind reinvest", () => {
    it("🧪 Should withdraw the accounts balance of aWeth", async () => {
      const aWethBal = await getErc20Balance(
        aWethContract,
        createdAccount.target,
      );
      const tx = await createdAccount.UnWindReinvest(1);
      await expect(tx.wait()).to.be.fulfilled;
      await expect(tx.wait())
        .to.emit(createdAccount, "StrategyReinvestUnwound")
        .withArgs(1, aWethBal, true);
    });
  });
});

/* 

      console.log(`
        account     :       ${createdAccount.target}
        executor    :       ${executorContract.target}
        reinvest    :       ${reinvestContract.target}
        executorEoa :       ${addressStore.executorEoa.address}
        deployer    :       ${addressStore.deployer.address}
        user        :       ${addressStore.user.address}
      `);
*/
