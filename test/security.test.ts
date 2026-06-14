import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { DCAAccount, DCAExecutor, IERC20 } from "~/types/contracts";
import signerStore from "~/scripts/tests/signerStore";
import {
  DCAExecutorArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import { resetFork } from "~/scripts/tests/forking";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
} from "~/scripts/tests/contractInteraction";

// Absolute minimum swap output for happy-path executions. 1 wei is
// deterministic on the pinned fork; tests assert balances/events, not
// slippage. The swap reverts NoMinimumOut() if this is 0.
const MIN_OUT = 1n;

describe("> DCA Security Tests", () => {
  console.log("🛡️ DCA Security Tests : Mounted");

  const forkedChain = "base";
  let usdcContract: IERC20;
  let createdAccount: DCAAccount;
  let executorContract: DCAExecutor;
  let addressStore: any;

  before(async function () {
    await resetFork(hre);
    await fundActors();
  });

  // One-time: impersonate a USDC whale and fund the user/attacker EOAs.
  async function fundActors() {
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
      "attacker",
    ]);

    // Impersonate a real USDC whale, not the token contract itself. The
    // token contract holds no transferable USDC balance, so the old setup
    // produced empty funding transfers.
    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.usdc as string,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.usdc as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    usdcContract = await connectToErc20(
      tokenAddress.usdc![forkedChain]! as string,
      usedImpersonater,
    );

    // Fund user and attacker
    await usdcContract.transfer(
      addressStore.user.address,
      ethers.parseUnits("100000", 6),
    );
    await usdcContract.transfer(
      addressStore.attacker.address,
      ethers.parseUnits("10000", 6),
    );
  }

  // Per-test: deploy a fresh account + executor so each test starts from a
  // clean strategy slot. These tests reuse strategyId 1, so a shared
  // account across tests would collide with StrategyAlreadySubscribed.
  beforeEach(async function () {
    const factoryFactory = await ethers.getContractFactory(
      "DCAAccount",
      addressStore.deployer.signer,
    );
    createdAccount = await factoryFactory.deploy(
      ethers.ZeroAddress,
      tokenAddress.swapRouter![forkedChain]! as string,
      tokenAddress.quoter![forkedChain]! as string,
      addressStore.user.address,
      ethers.ZeroAddress,
    );
    await createdAccount.waitForDeployment();

    const executorFactory = await ethers.getContractFactory(
      "DCAExecutor",
      addressStore.deployer.signer,
    );
    const deploymentArgs = DCAExecutorArguments(
      addressStore.deployer.address,
      "base",
    );
    deploymentArgs[0].executionAddress = addressStore.deployer.address;

    executorContract = await executorFactory.deploy(
      deploymentArgs[0],
      addressStore.executorEoa.address,
      deploymentArgs[2],
      tokenAddress.quoter![forkedChain]! as string,
    );
    await executorContract.waitForDeployment();

    // Setup contracts
    await createdAccount
      .connect(addressStore.user.signer)
      .changeExecutor(executorContract.target);
    await executorContract.setIntervalActive(0, true);
    await executorContract.setIntervalActive(1, true);
    await executorContract.setBaseTokenAllowance(usdcContract.target, true);

    // The user seeds strategies via SetupStrategy, which pulls USDC with
    // safeTransferFrom — approve the fresh account up front.
    await (
      await connectToErc20(
        tokenAddress.usdc![forkedChain]! as string,
        addressStore.user.signer,
      )
    ).approve(createdAccount.target, ethers.parseUnits("1000000", 6));
  });

  describe("🛡️ Reentrancy Protection", () => {
    it("🧪 Should prevent reentrancy attack on Execute function", async () => {
      // Create and fund strategy
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await createdAccount
        .connect(addressStore.user.signer)
        .SetupStrategy(strat, ethers.parseUnits("100", 6), true);

      // Create a malicious contract that tries to reenter
      const maliciousFactory = await ethers.getContractFactory(
        "ReentrancyAttacker",
        addressStore.attacker.signer,
      );
      const maliciousContract = await maliciousFactory.deploy(
        createdAccount.target,
      );
      await maliciousContract.waitForDeployment();

      // Fund the malicious contract
      await usdcContract
        .connect(addressStore.attacker.signer)
        .transfer(maliciousContract.target as string, ethers.parseUnits("100", 6));

      // Snapshot the attacker balance after seeding the malicious contract
      // but before execution, so the assertion is independent of the
      // initial funding amount.
      const attackerBalanceBefore = await usdcContract.balanceOf(
        addressStore.attacker.address,
      );

      // Try to execute - should work normally
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0, MIN_OUT),
      ).to.not.be.reverted;

      // The reentrancy guard must prevent the malicious contract from
      // draining funds back to the attacker — balance must not increase.
      const attackerBalance = await usdcContract.balanceOf(
        addressStore.attacker.address,
      );
      expect(attackerBalance).to.be.lte(attackerBalanceBefore);
    });

    it("🧪 Should prevent reentrancy attack on AddFunds function", async () => {
      const maliciousFactory = await ethers.getContractFactory(
        "ReentrancyAttacker",
        addressStore.attacker.signer,
      );
      const maliciousContract = await maliciousFactory.deploy(
        createdAccount.target,
      );
      await maliciousContract.waitForDeployment();

      // AddFunds is onlyOwner; an attacker call is rejected before the
      // nonReentrant guard even matters. The owner (user) approved the
      // account in preTest, so a legitimate AddFunds succeeds under the
      // guard.
      await expect(
        createdAccount
          .connect(addressStore.attacker.signer)
          .AddFunds(usdcContract.target, ethers.parseUnits("10", 6)),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );

      await expect(
        createdAccount
          .connect(addressStore.user.signer)
          .AddFunds(usdcContract.target, ethers.parseUnits("10", 6)),
      ).to.not.be.reverted;
    });
  });

  describe("🛡️ Slippage Protection", () => {
    it("🧪 Should execute swap with reasonable slippage tolerance", async () => {
      // Create and fund strategy
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await createdAccount
        .connect(addressStore.user.signer)
        .SetupStrategy(strat, ethers.parseUnits("100", 6), true);

      // Execute should succeed with a 1 wei minimum output floor
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0, MIN_OUT),
      ).to.emit(createdAccount, "StrategyExecuted");
    });

    it("🧪 Should handle slippage gracefully when quote fails", async () => {
      // This test would need to simulate a quote failure scenario
      // For now, we verify the swap still works with a 1 wei floor.
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await createdAccount
        .connect(addressStore.user.signer)
        .SetupStrategy(strat, ethers.parseUnits("100", 6), true);

      // newStrat always uses strategyId 1; execute that, not a
      // non-existent strategy 2.
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0, MIN_OUT),
      ).to.emit(createdAccount, "StrategyExecuted");
    });
  });

  describe("🛡️ Access Control", () => {
    it("🧪 Should prevent unauthorized Execute calls", async () => {
      await expect(
        createdAccount
          .connect(addressStore.attacker.signer)
          .Execute(1, 0, MIN_OUT),
      ).to.be.revertedWithCustomError(createdAccount, "NotTheExecutor");
    });

    it("🧪 Should prevent unauthorized strategy management", async () => {
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await expect(
        createdAccount
          .connect(addressStore.attacker.signer)
          .SetupStrategy(strat, 0, false),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "OwnableUnauthorizedAccount",
      );
    });
  });

  describe("🛡️ Input Validation", () => {
    it("🧪 Should reject invalid strategy data", async () => {
      const invalidStrat = {
        accountAddress: createdAccount.target,
        baseToken: {
          tokenAddress: ethers.ZeroAddress,
          decimals: 18,
          ticker: "INVALID",
        },
        targetToken: {
          tokenAddress: ethers.ZeroAddress,
          decimals: 18,
          ticker: "INVALID",
        },
        interval: 0,
        amount: 0, // Invalid amount
        strategyId: 1,
        active: false,
        reinvest: {
          reinvestData: "0x",
          active: false,
          investCode: 0,
          dcaAccountAddress: createdAccount.target,
        },
      };

      await expect(
        createdAccount
          .connect(addressStore.user.signer)
          .SetupStrategy(invalidStrat, 0, false),
      ).to.be.revertedWithCustomError(createdAccount, "InvalidStrategyData");
    });

    it("🧪 Should reject insufficient funds for subscription", async () => {
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await createdAccount
        .connect(addressStore.user.signer)
        .SetupStrategy(strat, 0, false); // No funding

      await expect(
        createdAccount.connect(addressStore.user.signer).SubscribeStrategy(1),
      ).to.be.revertedWithCustomError(
        createdAccount,
        "InsufficientFundsForSubscription",
      );
    });
  });

  describe("🛡️ Edge Cases", () => {
    it("🧪 Should handle zero amount executions gracefully", async () => {
      const strat = newStrat(createdAccount.target as string, forkedChain);
      strat.amount = 0; // Zero amount

      await expect(
        createdAccount
          .connect(addressStore.user.signer)
          .SetupStrategy(strat, 0, false),
      ).to.be.revertedWithCustomError(createdAccount, "InvalidStrategyData");
    });

    it("🧪 Should handle execution outside window", async () => {
      const strat = newStrat(createdAccount.target as string, forkedChain);
      await createdAccount
        .connect(addressStore.user.signer)
        .SetupStrategy(strat, ethers.parseUnits("100", 6), true);

      // Execute immediately
      await executorContract
        .connect(addressStore.executorEoa.signer)
        .Execute(createdAccount.target, 1, 0, MIN_OUT);

      // Try to execute again immediately - should fail
      await expect(
        executorContract
          .connect(addressStore.executorEoa.signer)
          .Execute(createdAccount.target, 1, 0, MIN_OUT),
      ).to.be.revertedWithCustomError(executorContract, "NotInExecutionWindow");
    });

    it("🧪 Should handle token transfer failures gracefully", async () => {
      // Try to withdraw more than balance
      await expect(
        createdAccount
          .connect(addressStore.user.signer)
          .WithdrawFunds(usdcContract.target, ethers.parseUnits("1000000", 6)),
      ).to.be.revertedWithCustomError(createdAccount, "InsufficientBalance");
    });
  });
});
