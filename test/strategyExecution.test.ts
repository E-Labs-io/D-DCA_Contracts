import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { AbiCoder, ZeroAddress, ethers as Ethers } from "ethers";
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
  let aWbtcContract: IAToken;
  let wbtcContract: IERC20;

  let createdAccount: DCAAccount;
  let reinvestContract: DCAReinvest;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  let Stat1Total: number = 0,
    Stat2Total: number = 0,
    totalSpend: number = 0,
    executions: number = 0;

  let deploymentArgs: any[];

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
      "executorBank",
      "comptBank",
      "adminBank",
    ]);

    aWethContract = (await connectToErc20(
      tokenAddress?.aWeth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    )) as IAToken;

    aWbtcContract = (await connectToErc20(
      tokenAddress?.aWbtc?.[forkedChain]! as string,
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
    const tx = await usdcContract.transfer(
      addressStore.user.address,
      ethers.parseUnits("200000", 6),
    );
    await tx.wait();

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

      deploymentArgs = DCAExecutorArguments(
        addressStore.deployer.address,
        "optimism",
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
        totalSpend = totalSpend + 100000000;
        executions++;
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
          await expect(tx.wait())
            .to.emit(createdAccount, "StrategyReinvestExecuted")
            .withArgs(1, true, (amount: any) => {
              Stat1Total = Stat1Total + Number(amount);
              return amount > 0;
            });
          totalSpend = totalSpend + 100000000;
          executions++;
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
    describe("💡 Should Create & Execute Strategy 2 (WBTC > aWBTC)", () => {
      let reinvestedAmount = 0;
      // Standard USDC > WBTC Strategy
      it("🧪 Should create a new Strategy (2)", async function () {
        // Create a custom strategy with interval 0
        const toBeEncoded = [
          0x12,
          tokenAddress.wbtc![forkedChain],
          tokenAddress.aWbtc![forkedChain],
        ];
        const reinvestData = abiEncoder.encode(
          ["uint8", "address", "address"],
          toBeEncoded,
        );
        const reinvest: IDCADataStructures.ReinvestStruct = {
          reinvestData,
          active: true,
          investCode: 0x12,
          dcaAccountAddress: createdAccount.target,
        };

        const newStrat: IDCADataStructures.StrategyStruct = buildStrat(
          createdAccount.target as string,
          forkedChain,
          {
            interval: 0,
            strategyId: 2,
            amount: Number(ethers.parseUnits("100", 6)),
            targetToken: {
              tokenAddress: tokenAddress.wbtc![forkedChain]!,
              decimals: 8,
              ticker: "WBTC",
            },
            reinvest: reinvest,
          },
        );

        // Give the user some USDC
        const contract = await ethers.getContractAt(
          "contracts/tokens/IERC20.sol:IERC20",
          tokenAddress?.usdc?.[forkedChain]! as string,
          addressStore.user.signer,
        );
        //  Approve the account to spend the base token
        const approve = await contract.approve(
          createdAccount.target,
          ethers.parseUnits("20000", 6),
        );
        await approve.wait();

        // Create the strategy
        const createStratTx = await createdAccount.SetupStrategy(
          newStrat,
          ethers.parseUnits("20000", 6),
          true,
        );
        await expect(createStratTx.wait()).to.be.fulfilled;
      });
      it("🧪 Should return there that strat 2 and reinvest is active", async function () {
        const stratsCheck = await createdAccount.getStrategyData(2);
        const stratActive = stratsCheck[6];
        const reinvestActive = stratsCheck[7][1];
        expect(stratActive).to.be.true;
        expect(reinvestActive).to.be.true;
      });
      it("🧪 Should return Account aWTBC balance of zero", async () => {
        const bal = await aWbtcContract.balanceOf(createdAccount.target);
        expect(bal).to.equal(0);
      });
      it("🧪 Should execute strategy 2", async () => {
        const tx = await executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 2);
        // Wait for the transaction to be mined

        // Check for the ExecutedDCA event from the executorContract
        await expect(tx)
          .to.emit(executorContract, "ExecutedDCA")
          .withArgs(createdAccount.target, 2);

        await expect(tx.wait())
          .to.emit(createdAccount, "StrategyReinvestExecuted")
          .withArgs(2, true, (amount: any) => {
            reinvestedAmount = amount;
            Stat2Total = Stat2Total + Number(amount);
            return amount > 0;
          });
        totalSpend = totalSpend + 100000000;
        executions++;
      });
      it("🧪 Should return account awbtc balance of more than zero", async () => {
        const bal = await aWbtcContract.balanceOf(createdAccount.target);
        expect(Number(bal)).to.equal(reinvestedAmount);
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
    });
    describe("💡 Should Execute each strategy 3 times", async () => {
      it("🧪 Should execute each strategy 3 times", async () => {
        for (let i = 0; i < 3; i++) {
          await advanceTime(70);

          // Strategy 1
          const tx1 = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1);
          // Wait for the transaction to be mined

          // Check for the ExecutedDCA event from the executorContract
          await expect(tx1)
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 1);

          await expect(tx1.wait())
            .to.emit(createdAccount, "StrategyReinvestExecuted")
            .withArgs(1, true, (amount: any) => {
              Stat1Total = Stat1Total + Number(amount);
              return amount > 0;
            });
          totalSpend = totalSpend + 100000000;
          executions++;
          // Strategy 2
          const tx2 = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 2);
          // Wait for the transaction to be mined

          // Check for the ExecutedDCA event from the executorContract
          await expect(tx2)
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 2);

          await expect(tx2.wait())
            .to.emit(createdAccount, "StrategyReinvestExecuted")
            .withArgs(2, true, (amount: any) => {
              Stat2Total = Stat2Total + Number(amount);
              return amount > 0;
            });
          totalSpend = totalSpend + 100000000;
          executions++;
        }
      });

      it("🧪 Should return Target 3 WETH Balance of Stat1Total", async () => {
        const bal = await wethContract.balanceOf(addressStore.target3.address);
        expect(Number(bal)).to.equal(Stat1Total);
      });

      it("🧪 Should return account aWBTCTotal of Stat2Total", async () => {
        const bal = await aWbtcContract.balanceOf(createdAccount.target);
        expect(Number(bal)).to.equal(Stat2Total);
      });

      it("🧪 Should revert both strategy's for not in window", async () => {
        await expect(
          executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1),
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
        await expect(
          executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 2),
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
      });

      it("🧪 Should return total spend of $900", () => {
        expect(totalSpend).to.equal(executions * 100000000);
      });
    });
    describe("💡 Should Execute each strategy 7 times", async () => {
      it("🧪 Should execute each strategy 7 times", async () => {
        for (let i = 0; i < 7; i++) {
          await advanceTime(70);

          // Strategy 1
          const tx1 = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1);
          // Wait for the transaction to be mined

          // Check for the ExecutedDCA event from the executorContract
          await expect(tx1)
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 1);

          await expect(tx1.wait())
            .to.emit(createdAccount, "StrategyReinvestExecuted")
            .withArgs(1, true, (amount: any) => {
              Stat1Total = Stat1Total + Number(amount);
              return amount > 0;
            });
          totalSpend = totalSpend + 100000000;
          executions++;

          // Strategy 2
          const tx2 = await executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 2);
          // Wait for the transaction to be mined

          // Check for the ExecutedDCA event from the executorContract
          await expect(tx2)
            .to.emit(executorContract, "ExecutedDCA")
            .withArgs(createdAccount.target, 2);

          await expect(tx2.wait())
            .to.emit(createdAccount, "StrategyReinvestExecuted")
            .withArgs(2, true, (amount: any) => {
              Stat2Total = Stat2Total + Number(amount);
              return amount > 0;
            });
          totalSpend = totalSpend + 100000000;
          executions++;
        }
      });

      it("🧪 Should return Target 3 WETH Balance of Stat1Total", async () => {
        const bal = await wethContract.balanceOf(addressStore.target3.address);
        expect(Number(bal)).to.equal(Stat1Total);
      });

      it("🧪 Should return account aWBTCTotal of Stat2Total", async () => {
        const bal = await aWbtcContract.balanceOf(createdAccount.target);
        expect(Number(bal)).to.equal(Stat2Total);
      });

      it("🧪 Should revert both strategy's for not in window", async () => {
        await expect(
          executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 1),
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
        await expect(
          executorContract
            .connect(addressStore.executorEoa.signer)
            .Execute(createdAccount.target, 2),
        ).to.be.revertedWith(
          "DCAAccount : [inWindow] Strategy Interval not met",
        );
      });
      it("🧪 Should return total spend of $1300", () => {
        expect(totalSpend).to.equal(executions * 100000000);
      });
    });
  });
  describe("💡 Should Check Executor Fee's and balances", async () => {
    let executorEOABal: number = 0;
    let adminBal: number = 0;
    let totalFee: number = 0;

    it("🧪 Should get Executor EOA & Admin Bank Balances", async () => {
      executorEOABal = Number(
        await getErc20Balance(usdcContract, deploymentArgs[0].executionAddress),
      );
      adminBal = Number(
        await getErc20Balance(usdcContract, deploymentArgs[0].adminAddress),
      );

      expect(executorEOABal).to.equal(0);
      expect(adminBal).to.equal(0);
    });
    it("🧪 Should check USDC Balance of Executor to be .3% of Total Executed", async () => {
      const bal = await usdcContract.balanceOf(executorContract.target);
      totalFee = calculatePercentage(30, executions * 100000000);

      expect(Number(bal)).to.equal(totalFee);
    });
    it("🧪 Should distribute the Fees", async () => {
      await expect(executorContract.DistributeFees(usdcContract.target)).to.be
        .fulfilled;
    });
    it("🧪 Should check correct amount to Executor EOA", async () => {
      const newEOABal = Number(
        await getErc20Balance(usdcContract, deploymentArgs[0].executionAddress),
      );
      const calculated =
        executorEOABal +
        calculatePercentage(
          Number(deploymentArgs[0].amountToExecutor),
          totalFee,
        );
      console.log("Check totalFee", totalFee);
      console.log("Check Old ExEOA Bal", executorEOABal);
      console.log("Check New ExEOA Bal", newEOABal);
      console.log("Calculate", calculated);
      console.log("Check % to move", deploymentArgs[0].amountToExecutor);

      expect(newEOABal).to.equal(calculated);
    });
    it("🧪 Should check correct amount to Admin EOA", async () => {
      const newAdminBal = Number(
        await getErc20Balance(usdcContract, deploymentArgs[0].adminAddress),
      );

      const calculated =
        adminBal +
        calculatePercentage(Number(deploymentArgs[0].amountToAdmin), totalFee);

      console.log("Check Old ExEOA Bal", adminBal);
      console.log("Check New ExEOA Bal", newAdminBal);
      console.log("Calculate", calculated);
      console.log("Check % to move", deploymentArgs[0].amountToAdmin);
      expect(newAdminBal).to.equal(calculated);
    });
    it("🧪 Should check USDC Balance of Executor to be Zero", async () => {
      const bal = await usdcContract.balanceOf(executorContract.target);
      expect(Number(bal)).to.equal(0);
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
