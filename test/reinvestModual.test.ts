import { expect, assert } from "chai";
import hre, { ethers } from "hardhat";
import { AbiCoder, AddressLike, Addressable, Contract, Signer } from "ethers";
import { DCAReinvestProxy, ForwardReinvest } from "~/types/contracts";
import { DCAReinvest } from "~/types/contracts/contracts/proxys/DCAReinvestProxy";

describe("> DCA Reinvest Modula Test", () => {
  console.log("🧪 DCA Reinvest Modula Test : Mounted");

  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let wethContract: Contract,
    wbtcContract: Contract,
    reinvestDeployment: DCAReinvestProxy;
  let addressStore: {
    [wallet: string]: { address: string | Addressable; signer: Signer };
  };
  const preTest = async () => {
    console.log("🧪 preTest : Mounted");
    // Get the accounts & signers
    const signers = await ethers.getSigners();
    console.log("All Signers", signers);
    const [deployer, tester] = signers;
    console.log("Got Tester Signer", tester);
    addressStore = {
      deployer: { address: await deployer.getAddress(), signer: deployer },
      tester: { address: await tester.getAddress(), signer: tester },
    };

    // Deploy the reinvest proxy contract
    const proxyFactory = await ethers.getContractFactory(
      "DCAReinvestProxy",
      deployer,
    );
    reinvestDeployment = await proxyFactory.deploy();
    await reinvestDeployment.waitForDeployment();
    const initTx = await reinvestDeployment.initialize(false);
    await initTx.wait();
    console.log("📍 Deployed Reinvest Contract", reinvestDeployment.target);

    // Connect to WETH & Transfer to wallet
    const wethImpersonator = await ethers.getImpersonatedSigner(
      "0x267ed5f71EE47D3E45Bb1569Aa37889a2d10f91e",
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
    // Connect to WBTC &Transfer to wallet

    /* 
    const wbtcImpersonator = await ethers.getImpersonatedSigner(
      "0x6daB3bCbFb336b29d06B9C793AEF7eaA57888922",
    );
    wbtcContract = await ethers.getContractAt(
      "contracts/tokens/IERC20.sol:IERC20",
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      wbtcImpersonator,
    );

    const wbtcTx = await wbtcContract.transfer(
      addressStore.tester.address,
      ethers.parseUnits("1", "ether"),
    );

    await wbtcTx.wait();  
    */
  };

  before(async function () {
    await preTest();
    console.log("🧪 pre test : Complete");
  });

  describe("💡 Check Wallet Balance", function () {
    it("🧪 WETH Should equal 1ETH", async function () {
      const wethBal = await wethContract.balanceOf(addressStore.tester.address);
      expect(wethBal).to.equal(ethers.parseUnits("1", "ether"));
    });
    /* it("🧪 WBTC Should equal 1ETH", async function () {
      const wethBal = await wbtcContract.balanceOf(addressStore.tester.address);
      expect(wethBal).to.equal(ethers.parseUnits("0", "ether"));
    }); */
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
    const forwardStratData = {
      moduleCode: 0x01,
      receiver: addressStore.tester.address,
      token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    };

    const reinvestData: DCAReinvest.ReinvestStruct = {
      reinvestData: abiEncoder.encode(["bytes"], [forwardStratData]),
      active: false,
      investCode: 0x01,
      dcaAccountAddress: addressStore.tester.address,
    };

    it("🧪 Should Fail", async function () {
      const executeReinvestTX = await reinvestDeployment.executeReinvest(
        reinvestData,
        ethers.parseEther("0.5"),
      );

      await executeReinvestTX.wait();
      console.log(executeReinvestTX);
    });
  });
});
