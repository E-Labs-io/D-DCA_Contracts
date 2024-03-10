import { expect, assert } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import {
  AbiCoder,
  AddressLike,
  Addressable,
  Contract,
  EventLog,
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
  Called,
  Caller,
  Called__factory,
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
import {
  connectToErc20,
  getErc20Balance,
  transferErc20Token,
} from "~/scripts/tests/contractInteraction";

describe("> Delegatecall Tests", () => {
  console.log("🧪 DCA Account Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: Contract;
  let wethContract: Contract;

  let proxyCalledContract: Contract;
  let calledContract: Called;
  let callerContract: Caller;
  let executorContract: DCAExecutor;
  let addressStore: SignerStore;

  const proxy = false;

  before(async function () {
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, ["deployer"]);
  }

  describe("💡 Deploy and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the Called Proxy Contract", async () => {
      // Deploy the reinvest proxy contract

      const proxyFactory = await ethers.getContractFactory(
        "CalledProxy",
        addressStore.deployer.signer,
      );
      proxyCalledContract = await upgrades.deployProxy(proxyFactory, [true], {
        unsafeAllow: ["delegatecall"],
      });

      await expect(proxyCalledContract.waitForDeployment()).to.be.fulfilled;
      //expect(recipt).to.emit(calledContract, "OwnershipTransferred");

      expect(proxyCalledContract.target).to.not.equal(ZeroAddress);
    });
    it("🧪 Should deploy the strait CAllED contract", async () => {
      const calledContractFactory = await ethers.getContractFactory(
        "Called",
        addressStore.deployer.signer,
      );

      calledContract = await calledContractFactory.deploy();
      await calledContract.waitForDeployment();
      calledContract = calledContract.connect(addressStore.deployer.signer);
      await expect(calledContractFactory.deploy()).to.be.fulfilled;
    });
    it("🧪 Should deploy the Caller Contract Contract", async () => {
      const calledContractFactory = await ethers.getContractFactory(
        "Caller",
        addressStore.deployer.signer,
      );

      callerContract = await calledContractFactory.deploy(
        calledContract.target,
      );
      await callerContract.waitForDeployment();
      callerContract = callerContract.connect(addressStore.deployer.signer);
      expect(callerContract.target).to.not.equal(ZeroAddress);
    });
    it("🧪 Should have Called contract address in the caller contract", async () => {
      const owner = await callerContract.calledContract();
      expect(owner).to.equal(calledContract.target);
    });
    it("🧪 Should get ProxyCalled contract active state", async () => {
      const state = await proxyCalledContract.active();
      expect(state).to.be.true;
    });
    it("🧪 Should get Called contract active state", async () => {
      const state = await calledContract.active();
      expect(state).to.be.true;
    });
  });

  describe("💡 Call the call function on normal contract", () => {
    it("🧪 Should call 'call()' and return from called event [420. true]", async () => {
      const tx = await callerContract.call();

      await expect(tx.wait())
        .to.emit(callerContract, "CompleteCall")
        .withArgs(420, true);
    });

    it("🧪 Should call 'call()' and return from called event [420. true]", async () => {
      const tx = await callerContract.call();
      const recipt = await tx.wait();

      expect(recipt)
        .to.emit(calledContract, "CallMeExecuted")
        .withArgs(420, true);
    });
  });

  describe("💡 Call the call function on proxy contract", () => {
    it("🧪 Should update the called address on caller contract", async () => {
      const tx = await callerContract.updateCalledAddress(
        proxyCalledContract.target,
      );
      const recipt = await tx.wait();

      expect(recipt)
        .to.emit(callerContract, "ChangedCalledAddress")
        .withArgs(proxyCalledContract.target);
    });

    it("🧪 Should call 'call()' and return from caller event [420. true]", async () => {
      const tx = await callerContract.call();
      const recipt = await tx.wait();

      const filter: EventLog[] = (await proxyCalledContract.queryFilter(
        proxyCalledContract.filters.CallMeExecuted,
        recipt?.hash,
      )) as EventLog[];

      const args = filter[0]?.args;
      console.log("@ CALLER EVENT @ Filtered Args", args);
      console.log("@ CALLER EVENT @  Recipt Logs", recipt?.logs);

      expect(recipt)
        .to.emit(callerContract, "CompleteCall")
        .withArgs(420, true);
    });

    it("🧪 Should call 'call()' and return from called event [420. true]", async () => {
      const tx = await callerContract.call();
      const recipt = await tx.wait();

      const filter: EventLog[] = (await proxyCalledContract.queryFilter(
        proxyCalledContract.filters.CallMeExecuted,
        recipt?.hash,
      )) as EventLog[];

      const args = filter[0]?.args;
      console.log("@ CALLED EVENT @  Filtered Args", args);
      console.log("@ CALLED EVENT @ Recipt Logs", recipt?.logs);

      expect(recipt)
        .to.emit(proxyCalledContract, "CallMeExecuted")
        .withArgs(420, true);
    });
  });
});
