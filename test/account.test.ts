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

describe("> DCA Account Tests", () => {
  console.log("🧪 DCA Account Tests : Mounted");

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
      productionChainImpersonators.eth.usdc,
    );

    usdcContract = await ethers.getContractAt(
      "contracts/tokens/IERC20.sol:IERC20",
      tokenAddress?.usdc?.eth! as string,
      usedImpersonater,
    );

    const tx = await usdcContract.transfer(
      addressStore.user.address,
      ethers.parseUnits("100000", 9),
    );
    await tx.wait();
  }

  describe("💡 Deploy and State Checks", function () {
    //  Deploy the Factory
    it("🧪 Should deploy the contract", async function () {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.deployer.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter.eth!,
        addressStore.user.address,
        ZeroAddress,
      );
      await createdAccount.waitForDeployment();
      expect(createdAccount.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should have the correct owner", async function () {
      const owner = await createdAccount.owner();
      expect(owner).to.equal(addressStore.user.address);
    });

    it("🧪 Should return the correct swap router", async function () {
      const address = await createdAccount.SWAP_ROUTER();
      expect(address).to.equal(tokenAddress.swapRouter.eth);
    });

    it("🧪 Should check the Executor address is the ZeroAddress", async function () {
      const state = await createdAccount.getExecutorAddress();
      expect(state).to.equal(ZeroAddress);
    });

    it("🧪 Should check the Reinvest address is the ZeroAddress", async function () {
      const state = await createdAccount.getAttachedReinvestLibraryAddress();
      expect(state).to.equal(ZeroAddress);
    });
    it("🧪 Should check the Reinvest Version and fail/revert", async function () {
      await expect(
        createdAccount.getAttachedReinvestLibraryVersion(),
      ).to.revertedWithoutReason();
    });
  });

  describe("💡 Update Library & Executor", async function () {
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

  describe("💡 Create Strategy and check States", function () {
    it("🧪 Should return there are no strategy's on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      expect(compareStructs(strats, EMPTY_STRATEGY)).to.be.true;
    });

    it("🧪 Should create a new Strategy", async function* () {
      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        "eth",
      );

      const createStratTx = await createdAccount.SetupStrategy(strat, 0, false);
      await createStratTx.wait();

      await expect(createStratTx).to.be.fulfilled;
    });

    it("🧪 Should fail to create a new Strategy", async function* () {
      const strat: IDCADataStructures.StrategyStruct = newStrat(
        createdAccount.target as string,
        "eth",
      );

      const createStratTx = await createdAccount
        .connect(addressStore.deployer.signer)
        .SetupStrategy(strat, 0, false);
      await createStratTx.wait();

      await expect(createStratTx).to.be.reverted;
    });

    /*   it("🧪 Should return there is 1 strategy on the account", async function () {
      const strats = await createdAccount.getStrategyData(1);
      console.log("Got Strat", strats);
      const checker = strats[0];
      expect(checker).to.equal(createdAccount.target);
    }); */
  });
});
