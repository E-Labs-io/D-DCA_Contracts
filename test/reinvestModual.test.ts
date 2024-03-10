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
import { DCAReinvest, DCAReinvestLogic } from "~/types/contracts";
import signerStore from "~/scripts/tests/signerStore";
import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";
import deploymentConfig from "~/bin/deployments.config";
import { decodePackedBytes } from "~/scripts/tests/comparisons";
import { getErc20Balance } from "~/scripts/tests/contractInteraction";

describe("> DCA Reinvest Modula Test", () => {
  console.log("🧪 DCA Reinvest Modula Test : Mounted");

  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();
  const forkedChain = deploymentConfig().masterChain;

  let reinvestDeployment: DCAReinvest;
  let wethContract: Contract, wbtcContract: Contract;

  let addressStore: {
    [wallet: string]: { address: string | Addressable; signer: Signer };
  };

  before(async function () {
    await preTest();
  });

  async function preTest() {
    // Get the accounts & signers
    addressStore = await signerStore(ethers, ["deployer", "tester"]);

    // Connect to WETH & Transfer to wallet
    const wethImpersonator = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]!.weth as string,
    );
    wethContract = await ethers.getContractAt(
      "contracts/tokens/IERC20.sol:IERC20",
      tokenAddress.weth![forkedChain] as string,
      wethImpersonator,
    );
    const wethTx = await wethContract.transfer(
      addressStore.tester.address,
      ethers.parseUnits("10", "ether"),
    );
    await wethTx.wait();
    const wethTx2 = await wethContract.transfer(
      addressStore.deployer.address,
      ethers.parseUnits("10", "ether"),
    );
    await wethTx2.wait();
  }

  describe("💡 Check Wallet Balance", function () {
    it("🧪 WETH Should equal 1ETH", async function () {
      const wethBal = await wethContract.balanceOf(addressStore.tester.address);
      expect(wethBal).to.equal(ethers.parseUnits("10", "ether"));
    });
  });

  describe("💡 Deploy & Check Ownership", function () {
    /* it("🧪 Should deploy the proxy contract", async function () {
      // Deploy the reinvest proxy contract
      const proxyFactory = await ethers.getContractFactory(
        "DCAReinvestProxy",
        addressStore.deployer.signer,
      );
      reinvestDeployment = await upgrades.deployProxy(proxyFactory, [false]);
      await reinvestDeployment.waitForDeployment();
      expect(reinvestDeployment.waitForDeployment()).to.be.fulfilled;
    }); */
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
      expect(version).to.equal("TEST V0.3");
    });
    it("🧪 Should Return the Reinvest is Not Active", async function () {
      const active = await reinvestDeployment.REINVEST_ACTIVE();
      expect(active).to.be.false;
    });
    it("🧪 Should Return the Reinvest is Active", async function () {
      await reinvestDeployment.setActiveState();
      const active = await reinvestDeployment.REINVEST_ACTIVE();
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
      const forwardStratData = [
        0x01,
        addressStore.tester.address,
        tokenAddress.weth![forkedChain],
      ];
      const reinvestData: DCAReinvestLogic.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          forwardStratData,
        ),
        active: false,
        investCode: 0x00,
        dcaAccountAddress: addressStore.tester.address,
      };

      await expect(reinvestDeployment.executeReinvest(reinvestData, 0)).to.be
        .fulfilled;
    });
    it("🧪 Should execute 0x01 (forward)", async function () {
      const forwardStratData = [
        0x01,
        addressStore.tester.address,
        tokenAddress.weth![forkedChain],
      ];
      const reinvestData: DCAReinvestLogic.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          forwardStratData,
        ),
        active: true,
        investCode: 0x01,
        dcaAccountAddress: addressStore.tester.address,
      };

      const con = await ethers.getContractAt(
        "contracts/tokens/IERC20.sol:IERC20",
        tokenAddress.weth![forkedChain] as string,
        addressStore.deployer.signer,
      );
      const tx = await con.approve(
        reinvestDeployment.target,
        ethers.parseEther("1"),
      );

      await tx.wait();
      const preTxBal = await getErc20Balance(
        wethContract,
        addressStore.tester.address,
      );
      const mainTx = await reinvestDeployment.executeReinvest(
        reinvestData,
        ethers.parseEther("0.5"),
      );

      await mainTx.wait();

      const postTxBal = await getErc20Balance(
        wethContract,
        addressStore.tester.address,
      );

      expect(preTxBal + ethers.parseEther("0.5") === postTxBal).to.be.true;
    });
    it("🧪 Should execute testCall()", async function () {
      await expect(reinvestDeployment.testCall()).to.emit(
        reinvestDeployment,
        "TestCall",
      );
    });
  });
});
