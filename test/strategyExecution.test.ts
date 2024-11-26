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
  buildStrat,
  DCAExecutorArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import { EMPTY_STRATEGY } from "~/bin/emptyData";
import { compareStructs } from "~/scripts/tests/comparisons";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
  getErc20Balance,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";
import { advanceTime } from "~/scripts/tests/timeControl";

describe("> DCA Strategy Executions Tests", () => {
  console.log("🧪 DCA Strategy Executions Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IERC20;
  let aWethContract: IAToken;
  let wbtcContract: IERC20;

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

    const wbtcImpersonator = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.wbtc as string,
    );

    wbtcContract = await connectToErc20(
      tokenAddress?.usdc?.[forkedChain]! as string,
      wbtcImpersonator,
    );
  }

  describe("💡 Deploy Account and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the account contract", async () => {
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
    it("🧪 Should return there are no strategy's on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      expect(compareStructs(strats, EMPTY_STRATEGY)).to.be.true;
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
    it("🧪 Should activate interval 0", async () => {
      expect(await executorContract.isIntervalActive(0)).to.be.false;
      await executorContract.setIntervalActive(0, true);
      expect(await executorContract.isIntervalActive(0)).to.be.true;
    });
    it("🧪 Should activate interval 1", async () => {
      expect(await executorContract.isIntervalActive(1)).to.be.false;
      await executorContract.setIntervalActive(1, true);
      expect(await executorContract.isIntervalActive(1)).to.be.true;
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
    it("🧪 Should Return the Reinvest Version", async function () {
      const version = await createdAccount.getAttachedReinvestLibraryVersion();
      expect(version).to.equal("TEST V0.5");
    });
  });

  describe("💡 Strategy Tests", () => {
    describe("💡 Should Create & Execute Strategy 1", () => {
      // Standard USDC > WETH Strategy
      it("🧪 Should create a new Strategy", async function () {
        const strat: IDCADataStructures.StrategyStruct = newStrat(
          createdAccount.target as string,
          forkedChain,
        );
        const createStratTx = await createdAccount.SetupStrategy(
          strat,
          0,
          false,
        );
        await expect(createStratTx.wait()).to.be.fulfilled;
      });
      it("🧪 Should return there is 1 strategy on the account", async function () {
        const stratsCheck = await createdAccount.getStrategyData(1);
        const checker = stratsCheck[0];
        expect(checker).to.equal(createdAccount.target);
      });
      it("🧪 Should fund the account with USDC", async function () {
        const contract = await await ethers.getContractAt(
          "contracts/tokens/IERC20.sol:IERC20",
          tokenAddress?.usdc?.[forkedChain]! as string,
          addressStore.user.signer,
        );
        const approve = await contract.approve(
          createdAccount.target,
          ethers.parseUnits("1000", 6),
        );
        await approve.wait();

        await expect(
          createdAccount.FundAccount(
            tokenAddress.usdc![forkedChain]!,
            ethers.parseUnits("1000", 6),
          ),
        ).to.be.fulfilled;
      });
      it("🧪 Should  subscribe to the executor", async () => {
        await expect(createdAccount.SubscribeStrategy(1n)).to.emit(
          createdAccount,
          "StrategySubscribed",
        );
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
      it("🧪 Should revert execute strategy 1, not in window", async () => {
        await expect(
          executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1),
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
      });
      it("🧪 Should show target WETH balance above 0", async () => {
        const balance = await createdAccount.getTargetBalance(
          tokenAddress.weth![forkedChain]!,
        );
        expect(balance > 0).to.be.true;
      });
      describe("💡 Strategy 1 Forward Reinvest Logic Test", () => {
        it("🧪 Should return false on active reinvest strategy 1", async () => {
          const stratData = await createdAccount.getStrategyData(1);
          expect(stratData[7][1]).to.be.false;
        });
        it("🧪 Should add forward reinvest to strategy 1", async () => {
          const reinvest: IDCADataStructures.ReinvestStruct = {
            reinvestData: abiEncoder.encode(
              ["uint8", "address", "address"],
              [
                0x01,
                addressStore.target3.address,
                tokenAddress.weth![forkedChain],
              ],
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
          const bal = await wethContract.balanceOf(
            addressStore.target3.address,
          );
          expect(bal).to.equal(0);
        });
        it("🧪 Should execute strategy 1", async () => {
          await advanceTime(75);
          const tx = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1);
          await expect(tx.wait())
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 1);

          await expect(tx.wait()).to.emit(createdAccount, "StrategyExecuted");
          await expect(tx.wait()).to.emit(
            createdAccount,
            "StrategyReinvestExecuted",
          );
        });
        it("🧪 Should return target3 weth balance of more than zero", async () => {
          const bal = await getErc20Balance(
            wethContract,
            addressStore.target3.address,
          );
          expect(Number(bal)).to.be.above(0);
        });
      });
    });
    describe("💡 Should Create & Execute Strategy 2", () => {
      // Standard USDC > WBTC Strategy
      it("🧪 Should create a new Strategy (2)", async function () {
        // Create a custom strategy with interval 0
        const newStrat: IDCADataStructures.StrategyStruct = buildStrat(
          createdAccount.target as string,
          forkedChain,
          {
            interval: 0,
            amount: Number(ethers.parseUnits("100", 6)),
            targetToken: {
              tokenAddress: tokenAddress.wbtc![forkedChain]!,
              decimals: 8,
              ticker: "WBTC",
            },
          },
        );

        //  Approve the account to spend the base token
        const approve = await wbtcContract.approve(
          createdAccount.target,
          ethers.parseUnits("1000", 6),
        );
        await approve.wait();

        await expect(
          createdAccount.FundAccount(
            tokenAddress.usdc![forkedChain]!,
            ethers.parseUnits("1000", 6),
          ),
        ).to.be.fulfilled;

        // Create the strategy
        const createStratTx = await createdAccount.SetupStrategy(
          newStrat,
          10000,
          false,
        );
        await expect(createStratTx.wait()).to.be.fulfilled;
      });
      it("🧪 Should return there is 2 strategy on the account", async function () {
        const stratsCheck = await createdAccount.getStrategyData(1);
        const checker = stratsCheck[0];
        expect(checker).to.equal(createdAccount.target);
      });
      it("🧪 Should  subscribe to the executor", async () => {
        await expect(createdAccount.SubscribeStrategy(2)).to.emit(
          createdAccount,
          "StrategySubscribed",
        );
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
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
      });
      it("🧪 Should show target WBTC balance above 0", async () => {
        const balance = await createdAccount.getTargetBalance(
          tokenAddress.wbtc![forkedChain]!,
        );
        expect(balance > 0).to.be.true;
      });
      describe("💡 Strategy 2 Forward Reinvest Logic Test", () => {
        it("🧪 Should return false on active reinvest strategy 2", async () => {
          const stratData = await createdAccount.getStrategyData(2);
          expect(stratData[7][1]).to.be.false;
        });
        it("🧪 Should add forward reinvest to strategy 2", async () => {
          const reinvest: IDCADataStructures.ReinvestStruct = {
            reinvestData: abiEncoder.encode(
              ["uint8", "address", "address"],
              [
                0x01,
                addressStore.target3.address,
                tokenAddress.weth![forkedChain],
              ],
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
          const bal = await wethContract.balanceOf(
            addressStore.target3.address,
          );
          expect(bal).to.equal(0);
        });
        it("🧪 Should execute strategy 1", async () => {
          await advanceTime(75);
          const tx = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1);
          await expect(tx.wait())
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 1);

          await expect(tx.wait()).to.emit(createdAccount, "StrategyExecuted");
          await expect(tx.wait()).to.emit(
            createdAccount,
            "StrategyReinvestExecuted",
          );
        });
        it("🧪 Should return target3 weth balance of more than zero", async () => {
          const bal = await getErc20Balance(
            wethContract,
            addressStore.target3.address,
          );
          expect(Number(bal)).to.be.above(0);
        });
      });
    });
  });
});
