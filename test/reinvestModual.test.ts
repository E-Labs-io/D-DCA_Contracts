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
import { DCAReinvest, DCAReinvestLogic, IERC20 } from "~/types/contracts";
import signerStore from "~/scripts/tests/signerStore";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import deploymentConfig from "~/bin/deployments.config";
import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";

import { decodePackedBytes } from "~/scripts/tests/comparisons";
import {
  connectToErc20,
  getErc20Balance,
  transferErc20Token,
} from "~/scripts/tests/contractInteraction";
import { resetFork } from "~/scripts/tests/forking";

describe("> DCA Reinvest Modula Test", () => {
  console.log("🧪 DCA Reinvest Modula Test : Mounted");

  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();
  const forkedChain = deploymentConfig().masterChain;

  let reinvestDeployment: DCAReinvest;
  let wethContract: IERC20, wbtcContract: IERC20;

  let addressStore: {
    [wallet: string]: { address: string | Addressable; signer: Signer };
  };

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    // Get the accounts & signers
    addressStore = await signerStore(ethers, [
      "deployer",
      "executorEoa",
      "user",
      "testTarget",
      "target2",
      "target3",
      "target4",
    ]);
    // Connect to WETH & Transfer to wallet
    const wethImpersonator = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]!.weth as string,
    );
    wethContract = await connectToErc20(
      tokenAddress?.weth?.[forkedChain]! as string,
      wethImpersonator,
    );
    const wethTx2 = await wethContract.transfer(
      addressStore.deployer.address,
      ethers.parseUnits("10", "ether"),
    );
    await wethTx2.wait();
  }

  describe("💡 Deploy & Check Ownership", function () {
    it("🧪 Should deploy the contract", async function () {
      const contractFactory = await ethers.getContractFactory(
        "DCAReinvest",
        addressStore.deployer.signer,
      );
      reinvestDeployment = await contractFactory.deploy(false);
      await reinvestDeployment.waitForDeployment();
      expect(reinvestDeployment.waitForDeployment()).to.be.fulfilled;
    });

    it("🧪 Should return the deployer address as owner", async function () {
      const owner = await reinvestDeployment.owner();
      expect(owner).to.equal(addressStore.deployer.address);
    });
  });

  describe("💡 Contract State", function () {
    it("🧪 Should Return the Reinvest Version", async function () {
      const version = await reinvestDeployment.getLibraryVersion();
      expect(version).to.equal("TEST V0.4");
    });
    it("🧪 Should Return the Reinvest is Not Active", async function () {
      const active = await reinvestDeployment.isActive();
      expect(active).to.be.false;
    });
    it("🧪 Should Return the Reinvest is Active", async function () {
      await reinvestDeployment.setActiveState();
      const active = await reinvestDeployment.isActive();
      expect(active).to.be.true;
    });
    it("🧪 Should Return the active reinvest strat array length of 2", async function () {
      const encodedData = await reinvestDeployment.ACTIVE_REINVESTS();
      const decodedData = decodePackedBytes(encodedData);

      expect(decodedData.length === 2).to.be.true;
    });
    it("🧪 Reinvest Active Strat element 2 should be Aave (0x12)", async function () {
      const encodedData = await reinvestDeployment.ACTIVE_REINVESTS();
      const decodedData = decodePackedBytes(encodedData)[1];
      expect(decodedData).to.equal(18);
    });
  });

  describe("💡 Strategy Execution", function () {
    it("🧪 Should Complete 0x00 (not active)", async function () {
      const reinvestData: IDCADataStructures.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [0x01, addressStore.user.address, tokenAddress.weth![forkedChain]],
        ),
        active: false,
        investCode: 0x00,
        dcaAccountAddress: addressStore.user.address,
      };

      await expect(reinvestDeployment.executeReinvest(reinvestData, 0)).to.be
        .fulfilled;
    });
    it("🧪 Should execute 0x01 (forward)", async function () {
      const reinvestData: IDCADataStructures.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          [0x01, addressStore.target4.address, tokenAddress.weth![forkedChain]],
        ),
        active: true,
        investCode: 0x01,
        dcaAccountAddress: ZeroAddress,
      };

      await transferErc20Token(
        wethContract,
        reinvestDeployment.target as Addressable,
        ethers.parseEther("0.5"),
      );
      const preTxBal = await getErc20Balance(
        wethContract,
        addressStore.target4.address,
      );
      const mainTx = await reinvestDeployment.executeReinvest(
        reinvestData,
        ethers.parseEther("0.5"),
      );

      await mainTx.wait();

      const postTxBal = await getErc20Balance(
        wethContract,
        addressStore.target4.address,
      );

      expect(preTxBal + ethers.parseEther("0.5") === postTxBal).to.be.true;
    });
  });
});
