import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { AbiCoder, Addressable, ZeroAddress } from "ethers";
import { DCAAccount, DCAExecutor, IERC20 } from "~/types/contracts";
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
import type { CometInterface, DCAReinvest } from "~/types/contracts";
import {
  approveErc20Spend,
  connectToErc20,
  getErc20Balance,
  getErc20ImpersonatedFunds,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";
import { advanceTime } from "~/scripts/tests/timeControl";
import { decodePackedBytes } from "~/scripts/tests/comparisons";

describe("> Compound V3 ETH Reinvest Test", () => {
  console.log("🧪 DCA Reinvest Modula : Compound V3 Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IERC20;
  let cWethContract: IERC20;
  let compV3Contract: CometInterface;

  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvest;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  let Stat1Total: number = 0,
    Stat2Total: number = 0,
    totalSpend: number = 0,
    executions: number = 0;

  let reinvestBalance: number = 0;
  let strategyBalance: number = 0;

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

    usdcContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address as Addressable,
      ethers.parseUnits("100000", 6),
      "usdc",
    );

    cWethContract = await connectToErc20(
      tokenAddress.compoundV3ETH![forkedChain]! as string,
      addressStore.deployer.signer,
    );

    usdcContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address as Addressable,
      ethers.parseUnits("250000", 6),
      "usdc",
    );

    wethContract = await getErc20ImpersonatedFunds(
      forkedChain,
      addressStore.user.address as Addressable,
      ethers.parseEther("10"),
      "weth",
    );

    compV3Contract = await ethers.getContractAt(
      "CometInterface",
      tokenAddress.compoundV3ETH![forkedChain] as string,
      addressStore.user.signer,
    );
  }

  describe("💡 Supply & Withdraw directly from Compound Contract (Weth)", () => {
    it("🧪 Should show balance of cWETH == 0", async () => {
      const bal = await getErc20Balance(
        cWethContract,
        addressStore.user.address,
      );
      expect(Number(bal)).to.equal(0);
    });
    it("🧪 Supply Weth to Compound", async () => {
      const connectedContract = wethContract.connect(addressStore.user.signer);
      const approveTx = await connectedContract.approve(
        tokenAddress.compoundV3ETH![forkedChain] as string,
        ethers.parseEther("1"),
      );
      await approveTx.wait();

      const tx = await compV3Contract.supply(
        tokenAddress.weth![forkedChain] as string,
        ethers.parseEther("1"),
      );

      await expect(tx.wait()).to.be.fulfilled;
    });
    it("🧪 Should show balance of cWETH > 0", async () => {
      const bal = await getErc20Balance(
        cWethContract,
        addressStore.user.address,
      );
      expect(Number(bal)).to.be.greaterThan(0);
    });
    it("🧪 Should Withdraw cWeth from Compound", async () => {
      const bal1 = await getErc20Balance(
        cWethContract,
        addressStore.user.address,
      );

      const tx = await compV3Contract.withdraw(
        tokenAddress.weth![forkedChain] as Addressable,
        ethers.parseEther("1"),
      );

      await expect(tx.wait()).to.be.fulfilled;
      const bal2 = await getErc20Balance(
        cWethContract,
        addressStore.user.address,
      );

      expect(bal2 < bal1).to.be.true;
    });
  });

  describe("💡 Deploy Account and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the Account contract", async () => {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.user.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter![forkedChain]! as string,
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

    it("🧪 Should Return the Reinvest Version", async function () {
      const version = await reinvestContract.getLibraryVersion();
      expect(version).to.equal("TEST V0.6");
    });

    it("🧪 Return Compound being active in array (0x11)", async function () {
      const encodedData = await reinvestContract.ACTIVE_REINVESTS();
      const decodedData = decodePackedBytes(encodedData);

      let active = false;
      for (let i = 0; i < decodedData.length; i++) {
        if (decodedData[i] === 0x11) active = true;
      }
      expect(active).to.be.true;
    });

    it("🧪 Should return the module name for the given code", async function () {
      const modualName = await reinvestContract.getModuleName(0x11);
      expect(modualName).to.equal("Compound V3 Reinvest");
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
        deploymentArgs[2],
      );
      await executorContract.waitForDeployment();
      expect(executorContract.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should activate the interval", async () => {
      expect(await executorContract.isIntervalActive(0)).to.be.false;
      await executorContract.setIntervalActive(0, true);
      expect(await executorContract.isIntervalActive(0)).to.be.true;
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
        .changeReinvestLibrary(reinvestContract.target);
      await updateAddressTx.wait();
      const address = await createdAccount.getAttachedReinvestLibraryAddress();
      expect(address).to.equal(reinvestContract.target);
    });
    it("🧪 Should set USDC as allowed base token", async function () {
      await executorContract.setBaseTokenAllowance(usdcContract.target, true);
      expect(await executorContract.isTokenAllowedAsBase(usdcContract.target))
        .to.be.true;
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
        ethers.parseUnits("10000", 6),
      ).catch((error) => console.log("approve error: ", error));

      const reinvest: IDCADataStructures.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [0x0, createdAccount.target, tokenAddress.weth![forkedChain]],
        ),
        active: true,
        investCode: 0x11,
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
        .to.emit(createdAccount, "StrategyCreated")
        .withArgs(1);
    });

    it("🧪 Should return there is strategy 1 on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      const checker = strats[0];
      expect(checker).to.equal(createdAccount.target);
    });
    it("🧪 Should show the reinvest is active on given strategy", async () => {
      const strats = await createdAccount.getStrategyData(1);
      expect(strats.reinvest.active).to.be.true;
    });
  });

  describe("💡 Execution", () => {
    it("🧪 Should show balance of cWETH == 0", async () => {
      const bal = await getErc20Balance(cWethContract, createdAccount.target);
      expect(bal).to.equal(0n);
    });
    it("🧪 Should execute strategy 1", async () => {
      const tx = await executorContract
        .connect(addressStore.executorEoa.signer)
        .Execute(createdAccount.target, 1, 0);

      const recipt = await tx.wait();

      await expect(recipt)
        .to.emit(createdAccount, "ReinvestExecuted")
        .withArgs(1, true, (amount: any) => {
          reinvestBalance += Number(amount);
          return true;
        });

      await expect(recipt)
        .to.emit(createdAccount, "StrategyExecuted")
        .withArgs(
          1,
          (amount: any) => {
            strategyBalance = Number(amount);
            return true;
          },
          true,
        );
    });
    it("🧪 Should get the Reinvest Balance of Strat", async () => {
      const bal = await createdAccount.getReinvestTokenBalance(1);
      expect(Number(bal)).to.equal(reinvestBalance);
    });
    it("🧪 Should show balance of cWETH > 0", async () => {
      const bal = await getErc20Balance(cWethContract, createdAccount.target);
      expect(Number(bal)).to.be.greaterThan(0);
    });
  });

  describe("💡 Unwind reinvest", () => {
    let wethBalance: number = 0;
    it("🧪 Should withdraw the accounts balance of cWeth", async () => {
      const tx = await createdAccount.UnwindReinvest(1);
      await expect(tx.wait()).to.be.fulfilled;
      await expect(tx.wait()).to.emit(createdAccount, "ReinvestUnwound");
    });
    it("🧪 Should show balance of aWETH == 0", async () => {
      const bal = await createdAccount.getReinvestTokenBalance(1);
      expect(Number(bal)).to.equal(0);
    });
    it("🧪 Should show true balance of cWETH > 0", async () => {
      const bal = await getErc20Balance(cWethContract, createdAccount.target);
      expect(Number(bal)).to.be.greaterThan(0);
    });
    it("🧪 Should show balance of WETH > 0", async () => {
      const bal = Number(
        await getErc20Balance(wethContract, createdAccount.target),
      );
      expect(bal).to.be.greaterThanOrEqual(strategyBalance - 100);
      wethBalance = bal;
    });
    it("🧪 Should force force unwind reinvest", async () => {
      const tx = await createdAccount.ForceUnwindReinvestPosition(
        1,
        cWethContract.target,
      );
      await expect(tx.wait()).to.be.fulfilled;
      await expect(tx.wait()).to.emit(createdAccount, "ReinvestUnwound");
    });
    it("🧪 Should show true balance of cWETH == 0", async () => {
      const bal = Number(
        await getErc20Balance(cWethContract, createdAccount.target),
      );
      expect(bal).to.equal(0);
    });
    it("🧪 Should show balance of WETH > last check", async () => {
      const bal = Number(
        await getErc20Balance(wethContract, createdAccount.target),
      );
      expect(bal).to.be.greaterThan(wethBalance);
    });
    it("🧪 Should revert withdrawal, No Investment to unwind", async () => {
      await expect(createdAccount.UnwindReinvest(1)).to.be.revertedWith(
        "[DCAAccount] : [UnWindReinvest] -  No investment to unwind",
      );
    });
  });

  describe("💡 Execute Strategy 10 times & Withdraw", () => {
    it("🧪 Should add funds to the account", async () => {
      reinvestBalance = 0;
      strategyBalance = 0;
      const contract = await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.usdc?.[forkedChain]! as string,
        addressStore.user.signer,
      );
      const approve = await contract.approve(
        createdAccount.target,
        ethers.parseUnits("150000", 6),
      );
      await approve.wait();

      await expect(
        createdAccount.AddFunds(
          tokenAddress.usdc![forkedChain]! as string,
          ethers.parseUnits("150000", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should execute strategy 10 times", async () => {
      for (let i = 0; i < 10; i++) {
        await advanceTime(70);

        // Strategy 1
        const tx = await executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0);

        const recipt = await tx.wait();

        await expect(recipt)
          .to.emit(createdAccount, "ReinvestExecuted")
          .withArgs(1, true, (amount: any) => {
            reinvestBalance += Number(amount);
            return true;
          });

        await expect(recipt)
          .to.emit(createdAccount, "StrategyExecuted")
          .withArgs(
            1,
            (amount: any) => {
              strategyBalance += Number(amount);
              return true;
            },
            true,
          );

        totalSpend = totalSpend + 1000000;
        executions++;
      }
    });
    it("🧪 Should show balance of cWETH == total from events", async () => {
      const bal = await createdAccount.getReinvestTokenBalance(1);
      expect(Number(bal)).to.equal(reinvestBalance);

      const trueBalance = Number(
        await getErc20Balance(cWethContract, createdAccount.target),
      );
      expect(reinvestBalance).to.be.greaterThanOrEqual(trueBalance - 200);
    });
    it("🧪 Should withdraw the accounts balance of cWeth", async () => {
      const tx = await createdAccount.UnwindReinvest(1);
      await expect(tx.wait()).to.be.fulfilled;
      await expect(tx.wait()).to.emit(createdAccount, "ReinvestUnwound");
    });
    it("🧪 Should show balance of aWETH == 0", async () => {
      const bal = await createdAccount.getReinvestTokenBalance(1);
      expect(Number(bal)).to.equal(0);
    });
  });
});
