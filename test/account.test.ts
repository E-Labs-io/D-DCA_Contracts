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
import { EMPTY_REINVEST, EMPTY_STRATEGY } from "~/bin/emptyData";
import { compareStructs } from "~/scripts/tests/comparisons";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
  getErc20Balance,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";

describe("> DCA Account Tests", () => {
  console.log("🧪 DCA Account Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IERC20;
  let aWethContract: IAToken;

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
      "target3",
    ]);

    aWethContract = (await connectToErc20(
      tokenAddress?.aWeth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    )) as IAToken;

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
    it("🧪 Should deploy the contract", async () => {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.deployer.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter![forkedChain]!,
        addressStore.user.address,
        ZeroAddress,
      );
      await expect(createdAccount.waitForDeployment()).to.be.fulfilled;
      createdAccount = createdAccount.connect(addressStore.user.signer);
      expect(createdAccount.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should have the correct owner", async () => {
      const owner = await createdAccount.owner();
      expect(owner).to.equal(addressStore.user.address);
    });

    it("🧪 Should return the correct swap router", async () => {
      const address = await createdAccount.SWAP_ROUTER();
      expect(address).to.equal(tokenAddress.swapRouter![forkedChain]);
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
    it("🧪 Should Return the Reinvest Version", async function () {
      const version = await createdAccount.getAttachedReinvestLibraryVersion();
      expect(version).to.equal("TEST V0.6");
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
      await expect(createStratTx.wait()).to.emit(
        createdAccount,
        "StrategyCreated",
      );
    });
    it("🧪 Should return there is 1 strategy on the account", async function () {
      const stratsCheck = await createdAccount.getStrategyData(1);
      const checker = stratsCheck[0];
      expect(checker).to.equal(createdAccount.target);
    });
  });
  describe("💡 Check Fund, Withdraw & Balances", () => {
    it("🧪 Should return 0 base balance of USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc![forkedChain]!,
      );
      expect(balance).to.equal(0);
    });
    it("🧪 Should return 0 target balance of WETH", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.weth![forkedChain]!,
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
        createdAccount.AddFunds(
          tokenAddress.usdc![forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should return the balance of 100 USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc![forkedChain]!,
      );
      expect(balance).to.equal(ethers.parseUnits("100", 6));
    });
    it("🧪 Should unfund the account with USDC", async function () {
      await expect(
        createdAccount.WithdrawFunds(
          tokenAddress.usdc![forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should return 0 base balance of USDC", async function () {
      const balance = await createdAccount.getBaseBalance(
        tokenAddress.usdc![forkedChain]!,
      );
      expect(balance).to.equal(0);
    });
    it("🧪 Should revert to withdraw WETH Target balance", async function () {
      await expect(
        createdAccount.WithdrawSavings(
          tokenAddress.weth![forkedChain]!,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.revertedWith(
        "[DCAAccount] : [WithdrawSavings] - Balance of token too low",
      );
    });
  });
  describe("💡 Subscribe strategy tests", () => {
    it("🧪 Should prove strategy 1 exists", async function () {
      const strats = await createdAccount.getStrategyData(1);
      const checker = strats[1];
      expect(checker[0]).to.equal(tokenAddress.usdc![forkedChain]);
    });
    it("🧪 Should revert on unsubscribe strategy 1", async () => {
      await expect(createdAccount.UnsubscribeStrategy(1n)).to.be.revertedWith(
        "DCAAccount : [UnsubscribeStrategy] Strategy is already Unsubscribed",
      );
    });
    it("🧪 Should revert on SubscribeStrategy not enough funds, ", async () => {
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
        createdAccount.AddFunds(
          tokenAddress.usdc![forkedChain]!,
          ethers.parseUnits("10000", 6),
        ),
      ).to.be.fulfilled;
    });
    it("🧪 Should revert subscribe to the executor, NotAllowedBaseToken", async () => {
      await expect(
        createdAccount.SubscribeStrategy(1n),
      ).to.be.revertedWithCustomError(executorContract, "NotAllowedBaseToken");
    });
    it("🧪 Should  subscribe to the executor", async () => {
      await executorContract.setBaseTokenAllowance(usdcContract.target, true);
      expect(await executorContract.isTokenAllowedAsBase(usdcContract.target))
        .to.be.true;

      await expect(createdAccount.SubscribeStrategy(1n)).to.emit(
        createdAccount,
        "StrategySubscription",
      );
    });
    it("🧪 Should revert on subscribe", async () => {
      await expect(createdAccount.SubscribeStrategy(1n)).to.be.revertedWith(
        "DCAAccount : [SubscribeStrategy] Strategy is already Subscribed",
      );
    });
    it("🧪 Should create new strategy (2), fund & subscribe", async () => {
      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        forkedChain,
      );

      strat.strategyId = 2;
      const contract = await ethers.getContractAt(
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
      await expect(createdAccount.UnsubscribeStrategy(1n)).to.emit(
        createdAccount,
        "StrategySubscription",
      );
    });
  });
  describe("💡 Execute strategy", () => {
    it("🧪 Should revert on as strategy (1) is not subscribed", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0),
      ).to.be.revertedWith("DCAExecutor : [Execute] Strategy not subscribed");
    });
    it("🧪 Should execute strategy 2", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 2, 0),
      )
        .to.emit(executorContract, "ExecutedStrategy")
        .withArgs(createdAccount.target, 2);
    });
    it("🧪 Should revert execute strategy 2, not in window", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 2, 0),
      ).to.be.revertedWith("DCAExecutor : [Execute] Not in execution window");
    });
    it("🧪 Should show target WETH balance above 0", async () => {
      const balance = await createdAccount.getTargetBalance(
        tokenAddress.weth![forkedChain]!,
      );
      expect(balance > 0).to.be.true;
    });
    it("🧪 Should ForceUnsubscribe strategy 2", async () => {
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .ForceUnsubscribe(createdAccount.target, 2n, 0),
      )
        .to.emit(createdAccount, "StrategySubscription")
        .withArgs(2n, executorContract.target, false);
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
        "StrategySubscription",
      );
    });
    it("🧪 Should add forward reinvest to strategy 1", async () => {
      const reinvest: IDCADataStructures.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [0x01, addressStore.target3.address, tokenAddress.weth![forkedChain]],
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
    it("🧪 Should return target3 weth balance of zero", async () => {
      const bal = await wethContract.balanceOf(addressStore.target3.address);
      expect(bal).to.equal(0);
    });
    it("🧪 Should execute strategy 1", async () => {
      const tx = await executorContract
        .connect(addressStore.executorEoa.signer)
        .Execute(createdAccount.target, 1, 0);
      await expect(tx.wait())
        .to.emit(executorContract, "ExecutedStrategy")
        .withArgs(createdAccount.target, 1);

      await expect(tx.wait()).to.emit(createdAccount, "StrategyExecuted");
      await expect(tx.wait()).to.emit(createdAccount, "ReinvestExecuted");
    });
    it("🧪 Should return target3 weth balance of more than zero", async () => {
      const bal = await getErc20Balance(
        wethContract,
        addressStore.target3.address,
      );
      expect(Number(bal)).to.be.above(0);
    });
  });
  describe("💡 Security checks", () => {
    it("🧪 Should revert on changeExecutor, Not owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .changeExecutor(addressStore.user.address),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on changeReinvestLibrary, Not owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .changeReinvestLibrary(addressStore.user.address),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on Execute, Not Executor", async () => {
      await expect(
        createdAccount.connect(addressStore.deployer.signer).Execute(1, 0),
      ).to.be.revertedWith(
        "OnlyExecutor : [onlyExecutor] Address is not an executor",
      );
    });
    it("🧪 Should revert on SetupStrategy, Not Account owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .SetupStrategy(
            newStrat(createdAccount.target as string, forkedChain),
            0,
            false,
          ),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on UnsubscribeStrategy, Not Account owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .UnsubscribeStrategy(1n),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on SubscribeStrategy, Not Account owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.user.signer)
          .UnsubscribeStrategy(1n),
      ).to.be.fulfilled;

      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .SubscribeStrategy(1n),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on UnwindReinvest, Not Executor", async () => {
      await expect(
        createdAccount.connect(addressStore.deployer.signer).UnwindReinvest(1n),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on ExecutorDeactivate, Not Executor", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .ExecutorDeactivate(1n),
      ).to.be.revertedWith(
        "OnlyExecutor : [onlyExecutor] Address is not an executor",
      );
    });
    it("🧪 Should revert on setStrategyReinvest, Not Owner", async () => {
      let reinvest: IDCADataStructures.ReinvestStruct = {
        reinvestData: "0x",
        active: false,
        investCode: 0,
        dcaAccountAddress: ZeroAddress,
      };
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .setStrategyReinvest(1n, reinvest),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
    it("🧪 Should revert on updateSwapAddress, Not Owner", async () => {
      await expect(
        createdAccount
          .connect(addressStore.deployer.signer)
          .updateSwapAddress(addressStore.user.address),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
  });
});
