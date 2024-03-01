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
import { DCAReinvestProxy, ForwardReinvest } from "~/types/contracts";
import { DCAReinvest } from "~/types/contracts/contracts/proxys/DCAReinvestProxy";
import signerStore from "~/scripts/tests/signerStore";
import { productionChainImpersonators } from "~/bin/tokenAddress";

describe("> DCA Reinvest Modula Test", () => {
  console.log("🧪 DCA Reinvest Modula Test : Mounted");

  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let reinvestDeployment: DCAReinvestProxy;
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
      productionChainImpersonators.eth.weth,
    );
    wethContract = await ethers.getContractAt(
      "contracts/tokens/IERC20.sol:IERC20",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      wethImpersonator,
    );
    const wethTx = await wethContract.transfer(
      addressStore.tester.address,
      ethers.parseUnits("1", "ether"),
    );
    await wethTx.wait();
  }

  describe("💡 Check Wallet Balance", function () {
    it("🧪 WETH Should equal 1ETH", async function () {
      const wethBal = await wethContract.balanceOf(addressStore.tester.address);
      expect(wethBal).to.equal(ethers.parseUnits("1", "ether"));
    });
  });

  describe("💡 Deploy Proxy & Check Ownership", function () {
    it("🧪 Should deploy the contract", async function () {
      // Deploy the reinvest proxy contract
      const proxyFactory = await ethers.getContractFactory(
        "DCAReinvestProxy",
        addressStore.deployer.signer,
      );
      reinvestDeployment = await proxyFactory.deploy();
      await reinvestDeployment.waitForDeployment();
      const initTx = await reinvestDeployment.initialize(false);
      await initTx.wait();
      expect(reinvestDeployment.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should return the deployer address as owner", async function () {
      const owner = await reinvestDeployment.owner();
      expect(owner).to.equal(addressStore.deployer.address);
    });
  });

  describe("💡 Contract State", function () {
    let decodedValue: any[];
    it("🧪 Should Return the Reinvest Version", async function () {
      const version = await reinvestDeployment.REINVEST_VERSION();
      expect(version).to.equal("ETH_SEPOLIA V0.2");
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
    it("🧪 Should Return the active reinvest strat array", async function () {
      const encodedData = await reinvestDeployment.ACTIVE_REINVESTS();
      decodedValue = abiEncoder.decode(["uint8"], encodedData);
      expect(Array.isArray(decodedValue)).to.be.true;
    });

    it("🧪 Reinvest Active Strat element 1 should be Forward (1)", async function () {
      const elemtnOne = Number(decodedValue[0]);
      expect(elemtnOne).to.equal(1);
    });
  });

  describe("💡 Forward Strategy", function () {
    it("🧪 Should Fail", async function () {
      const forwardStratData = [
        0x01,
        addressStore.tester.address,
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ];
      const reinvestData: DCAReinvest.ReinvestStruct = {
        reinvestData: abiEncoder.encode(
          ["uint8", "address", "address"],
          forwardStratData,
        ),
        active: false,
        investCode: 0x01,
        dcaAccountAddress: addressStore.tester.address,
      };

      await expect(
        reinvestDeployment.executeReinvest(
          reinvestData,
          ethers.parseEther("0.5"),
        ),
      ).to.revertedWithoutReason();
    });
  });
});
