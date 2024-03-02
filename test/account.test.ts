import { expect, assert } from "chai";
import hre, { ethers } from "hardhat";
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
import { DCAReinvest } from "~/types/contracts/contracts/base/DCAAccount";

describe("> DCA Account Tests", () => {
  console.log("🧪 DCA Account Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: Contract;
  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvestProxy;
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
    ]);

    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain].usdc,
    );

    usdcContract = await ethers.getContractAt(
      "contracts/tokens/IERC20.sol:IERC20",
      tokenAddress?.usdc?.[forkedChain]! as string,
      usedImpersonater,
    );

    const tx = await usdcContract.transfer(
      addressStore.user.address,
      ethers.parseUnits("100000", 9),
    );
    await tx.wait();
  }

  describe("💡 Deploy and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the contract", async () => {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.user.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter[forkedChain]!,
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

    it("🧪 Should return the correct swap router", async () => {
      const address = await createdAccount.SWAP_ROUTER();
      expect(address).to.equal(tokenAddress.swapRouter[forkedChain]);
    });

    it("🧪 Should check the Executor address is the ZeroAddress", async () => {
      const state = await createdAccount.getExecutorAddress();
      expect(state).to.equal(ZeroAddress);
    });

    it("🧪 Should check the Reinvest address is the ZeroAddress", async () => {
      const state = await createdAccount.getAttachedReinvestLibraryAddress();
      expect(state).to.equal(ZeroAddress);
    });
    it("🧪 Should check the Reinvest Version and fail/revert", async () => {
      await expect(
        createdAccount.getAttachedReinvestLibraryVersion(),
      ).to.revertedWithoutReason();
    });
  });

  describe("💡 Update Library & Executor", () => {
    it("🧪 Should deploy the library contract", async function () {
      // Deploy the reinvest proxy contract
      const proxyFactory = await ethers.getContractFactory(
        "DCAReinvestProxy",
        addressStore.deployer.signer,
      );
      reinvestContract = await proxyFactory.deploy();
      await reinvestContract.waitForDeployment();
      const initTx = await reinvestContract.initialize(false);
      await initTx.wait();
      expect(reinvestContract.target).to.not.equal(ZeroAddress);
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

  describe("💡 Execute a SWAP test", () => {
    it("🧪Should fail to execute a SWAP test", async function () {
      await expect(
        createdAccount.SWAP(
          tokenAddress.usdc[forkedChain]!,
          tokenAddress.weth[forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.reverted;
    });

    it("🧪Should transfer USDC to account", async function () {
      await expect(
        usdcContract.transfer(
          createdAccount.target,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });

    it("🧪Should fail to execute a SWAP test", async function () {
      await expect(
        createdAccount.SWAP(
          tokenAddress.usdc[forkedChain]!,
          tokenAddress.weth[forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
  });

  describe("💡 Create Strategy and check States", () => {
    it("🧪 Should return there are no strategy's on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      expect(compareStructs(strats, EMPTY_STRATEGY)).to.be.true;
    });
    it("🧪 Should fail to create a new Strategy", async function () {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .SetupStrategy(
            newStrat(createdAccount.target as string, forkedChain),
            0,
            false,
          ),
      )
        .to.be.revertedWithCustomError(
          createdAccount,
          "OwnableUnauthorizedAccount",
        )
        .withArgs(addressStore.deployer.address);
    });
    it("🧪 Should create a new Strategy", async function () {
      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
      );
      const createStratTx = await createdAccount.SetupStrategy(strat, 0, false);
      await expect(createStratTx.wait()).to.be.fulfilled;
    });
    it("🧪 Should return there is 1 strategy on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      const checker = strats[0];
      expect(checker).to.equal(createdAccount.target);
    });
    it("🧪 Should return the Base Block Cost as 0", async function () {
      const costPerBlock = await createdAccount.getBaseTokenCostPerBlock(
        tokenAddress.usdc[forkedChain] as string,
      );
      expect(costPerBlock).to.equal(0);
    });
  });

  describe("💡 Check Fund, Withdraw & Balances", () => {
    it("🧪 Should return 0 base balance of USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc[forkedChain]!,
      );
      expect(balance).to.equal(0);
    });
    it("🧪 Should return 0 target balance of WETH", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.weth[forkedChain]!,
      );
      expect(balance).to.equal(0);
    });
    it("🧪 Should fund the account with USDC", async function () {
      const contract = await await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.usdc?.[forkedChain]! as string,
        addressStore.user.signer,
      );
      const approve = await contract.approve(
        createdAccount.target,
        ethers.parseUnits("100", 6),
      );
      await approve.wait();

      await expect(
        createdAccount.FundAccount(
          tokenAddress.usdc[forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should return the balance of 100 USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc[forkedChain]!,
      );
      expect(balance).to.equal(ethers.parseUnits("100", 6));
    });
    it("🧪 Should unfund the account with USDC", async function () {
      await expect(
        createdAccount.UnFundAccount(
          tokenAddress.usdc[forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should return 0 base balance of USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc[forkedChain]!,
      );
      expect(balance).to.equal(0);
    });
    it("🧪 Should revert to withdraw WETH Target balance", async function () {
      await expect(
        createdAccount.WithdrawSavings(
          tokenAddress.weth[forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.revertedWith(
        "DCAAccount : [WithdrawSavings] Balance of token to low",
      );
    });
    it("🧪 Should return the Base Block Cost as 0", async function () {
      const costPerBlock = await createdAccount.getBaseTokenCostPerBlock(
        tokenAddress.usdc[forkedChain] as string,
      );
      expect(costPerBlock).to.equal(0);
    });
  });

  describe("💡 Subscribe strategy tests", () => {
    it("🧪 Should prove strategy 1 exists", async function () {
      const strats = await createdAccount.getStrategyData(1);
      const checker = strats[1];
      expect(checker[0]).to.equal(tokenAddress.usdc[forkedChain]);
    });
    it("🧪 Should revert on unsubscribe strategy 1", async () => {
      await expect(createdAccount.UnsubscribeStrategy(1n)).to.be.revertedWith(
        "DCAAccount : [UnsubscribeStrategy] Strategy is already Unsubscribed",
      );
    });
    it("🧪 Should revert on subscribe", async () => {
      await expect(createdAccount.SubscribeStrategy(1n)).to.be.revertedWith(
        "DCAAccount : [SubscribeStrategy] Need to have 5 executions funded to subscribe",
      );
    });
    it("🧪 Should fund the account with USDC", async function () {
      const contract = await await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.usdc?.[forkedChain]! as string,
        addressStore.user.signer,
      );
      const approve = await contract.approve(
        createdAccount.target,
        ethers.parseUnits("10000", 6),
      );
      await approve.wait();

      await expect(
        createdAccount.FundAccount(
          tokenAddress.usdc[forkedChain]!,
          ethers.parseUnits("10000", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should  subscribe to the executor", async () => {
      await expect(createdAccount.SubscribeStrategy(1n)).to.emit(
        createdAccount,
        "StrategySubscribed",
      );
    });
    it("🧪 Should revert on subscribe", async () => {
      await expect(createdAccount.SubscribeStrategy(1n)).to.be.revertedWith(
        "DCAAccount : [SubscribeStrategy] Strategy is already Subscribed",
      );
    });
    it("🧪 Should create new strategy, fund & subscribe", async () => {
      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
      );
      const contract = await await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.usdc?.[forkedChain]! as string,
        addressStore.user.signer,
      );
      const approve = await contract.approve(
        createdAccount.target,
        ethers.parseUnits("10000", 6),
      );
      await approve.wait();
      const createStratTx = await createdAccount.SetupStrategy(
        strat,
        ethers.parseUnits("10000", 6),
        true,
      );
      await expect(createStratTx.wait()).to.be.fulfilled;
    });
    it("🧪 Should unsubscribe strategy 1", async () => {
      await expect(createdAccount.UnsubscribeStrategy(1n)).to.be.fulfilled;
    });
  });

  describe("💡 Execute strategy", () => {
    it("🧪 Should revert on as strategy is not active", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1),
      ).to.be.revertedWith("DCAAccount : [Execute] Strategy is not active");
    });
    it("🧪 Should execute strategy 2", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 2),
      )
        .to.emit(executorContract, "ExecutedDCA")
        .withArgs(createdAccount.target, 2);
    });
    it("🧪 Should revert execute strategy 2, not in window", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 2),
      ).to.be.revertedWith("DCAAccount : [inWindow] Strategy Interval not met");
    });
    it("🧪 Should show target WETH balance above 0", async () => {
      const balance = await createdAccount.getTargetBalance(
        tokenAddress.weth[forkedChain]!,
      );
      expect(balance > 0).to.be.true;
    });
  });

  describe("💡 Reinvest Logic Test", () => {
    it("🧪 Should return false on active reinvest strategy 1", async () => {
      const stratData = await createdAccount.getStrategyData(1);
      expect(stratData[7][1]).to.be.false;
    });
    it("🧪 Should subscribe to the executor", async () => {
      await expect(createdAccount.SubscribeStrategy(1n)).to.emit(
        createdAccount,
        "StrategySubscribed",
      );
    });
    it("🧪 Should add forward reinvest to strategy 1", async () => {
      const forwardStratData = [
        0x01,
        addressStore.executorEoa.address,
        tokenAddress.weth[forkedChain],
      ];
      const reinvest: DCAReinvest.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          forwardStratData,
        ),
        active: true,
        investCode: 0x01,
        dcaAccountAddress: createdAccount.target,
      };
      const tx = await createdAccount.setStrategyReinvest(1, reinvest);
      await tx.wait();
      const stratData = await createdAccount.getStrategyData(1);
      expect(stratData[7][1]).to.be.true;
    });
    it("🧪 Should return executor weth balance of zero", async () => {
      const wethContract = await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.weth?.[forkedChain]! as string,
      );
      const bal = await wethContract.balanceOf(
        addressStore.executorEoa.address,
      );
      expect(bal).to.equal(0);
    });
    it("🧪 Should execute strategy 1", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1),
      )
        .to.emit(executorContract, "ExecutedDCA")
        .withArgs(createdAccount.target, 1);
    });
    it("🧪 Should return executor weth balance of more than zero", async () => {
      const wethContract = await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress?.weth?.[forkedChain]! as string,
      );
      const bal = await wethContract.balanceOf(
        addressStore.executorEoa.address,
      );
      console.log("Got Bal:", bal);
      expect(Number(bal) > 0).to.be.true;
    });
  });
});
