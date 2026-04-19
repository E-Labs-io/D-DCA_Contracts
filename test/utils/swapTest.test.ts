import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
  AbiCoder,
  AddressLike,
  BigNumberish,
  Typed,
  ZeroAddress,
} from "ethers";
import { DCAAccount, IERC20, IWETH9, SwapTest } from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";

import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";

import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
} from "~/scripts/tests/contractInteraction";

import { resetFork } from "~/scripts/tests/forking";

describe("> Uniswap Tests Tests", () => {
  console.log("🧪 Swap Contract : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let usdcContract: IERC20;
  let wethContract: IWETH9;

  let createdAccount: DCAAccount;
  let addressStore: SignerStore;
  let swapTest: SwapTest;

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, ["deployer"]);

    // USDC
    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.usdc as string,
    );
    usdcContract = await connectToErc20(
      tokenAddress.usdc![forkedChain]! as string,
      usedImpersonater,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.usdc as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    const tx = await usdcContract.transfer(
      addressStore.deployer.address,
      ethers.parseUnits("200000", 6),
    );
    await tx.wait();

    //  WETH
    wethContract = await ethers.getContractAt(
      "IWETH9",
      tokenAddress.weth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    );
  }

  describe("💡 Deploy SwapTest", () => {
    it("🧪 Should deploy SwapTest", async () => {
      const swapTestFactory = await ethers.getContractFactory(
        "SwapTest",
        addressStore.deployer.signer,
      );
      swapTest = await swapTestFactory.deploy(
        tokenAddress.swapRouter![forkedChain]! as string,
        tokenAddress.quoter![forkedChain]! as string,
      );
      await expect(swapTest.waitForDeployment()).to.be.fulfilled;
    });
    it("🧪 Should return the SwapRouter address", async () => {
      const router = await swapTest.SWAP_ROUTER();
      expect(router).to.equal(tokenAddress.swapRouter![forkedChain]);
    });
  });

  describe("💡 Check balances & Allowances", () => {
    it("🧪 Should show 0 WETH balance", async () => {
      const tx = await wethContract.balanceOf(swapTest.target);
      expect(tx).to.equal(0);
    });
    it("🧪 Should show 0 ETH balance", async () => {
      const tx2 = await ethers.provider.getBalance(swapTest.target);
      expect(tx2).to.equal(0);
    });
    it("🧪 Should show 0 USDC balance", async () => {
      const tx3 = await usdcContract.balanceOf(swapTest.target);
      expect(tx3).to.equal(0);
    });
    it("🧪 Should return the USDC balance of contract $20000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);
      const tx = await contract.transfer(
        swapTest.target,
        ethers.parseUnits("20000", 6),
      );
      await tx.wait();
      const tx2 = await contract.balanceOf(swapTest.target);
      expect(tx2).to.equal(ethers.parseUnits("20000", 6));
    });
  });

  describe("💡 Token to Token Swap", () => {
    it("🧪 Should revert a USDC > WETH trade - Not spend approved", async () => {
      await expect(
        swapTest.swapTokensInContract(
          usdcContract.target,
          wethContract.target,
          ethers.parseUnits("1000", 6),
        ),
      ).to.be.revertedWith("STF");
    });

    it("🧪 Should approve the swaprouter to spend USDC", async () => {
      const tx = await swapTest.setAllowance(
        usdcContract.target,
        ethers.parseUnits("1000", 6),
      );
      await expect(tx.wait()).to.be.fulfilled;
    });

    it("🧪 Should show swapRouter allowance of $1000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract?.allowance(
        swapTest.target as AddressLike,
        tokenAddress.swapRouter![forkedChain] as AddressLike,
      );
      expect(tx).to.equal(ethers.parseUnits("1000", 6));
    });

    it("🧪 Should execute a USDC > WETH trade", async () => {
      const tx = await swapTest.swapTokensInContract(
        usdcContract.target,
        wethContract.target,
        ethers.parseUnits("1000", 6),
      );
      await expect(tx.wait()).to.be.fulfilled;
      const bal = await wethContract.balanceOf(addressStore.deployer.address);
      expect(bal).to.greaterThanOrEqual(0);
    });
  });
  describe("💡 Token to ETH Swap", () => {
    let deployeerEthBal: number;
    let deployerWethBal: number;
    it("🧪 Should revert a USDC > ETH trade - Not spend approved", async () => {
      await expect(
        swapTest.swapTokensToEthToTarget(
          usdcContract.target,
          ethers.parseUnits("1000", 6),
          addressStore.deployer.address,
        ),
      ).to.be.revertedWith("STF");
    });

    it("🧪 Should approve the swaprouter to spend USDC", async () => {
      const tx = await swapTest.setAllowance(
        usdcContract.target,
        ethers.parseUnits("1000", 6),
      );
      await expect(tx.wait()).to.be.fulfilled;
    });

    it("🧪 Should show swapRouter allowance of $1000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract?.allowance(
        swapTest.target as AddressLike,
        tokenAddress.swapRouter![forkedChain] as AddressLike,
      );
      expect(tx).to.equal(ethers.parseUnits("1000", 6));
    });

    it("🧪 Should execute a USDC > ETH trade", async () => {
      deployeerEthBal = Number(
        await ethers.provider.getBalance(addressStore.deployer.address),
      );
      deployerWethBal = Number(
        await wethContract.balanceOf(addressStore.deployer.address),
      );
      console.log("🧪 deployeerEthBal", deployeerEthBal);

      const swapTX = await swapTest.swapTokensToEthToTarget(
        usdcContract.target,
        ethers.parseUnits("1000", 6),
        addressStore.deployer.address,
      );
      await expect(swapTX.wait()).to.be.fulfilled;
    });
    it("🧪 Should show ETH balance > 0", async () => {
      const tx2 = Number(
        await ethers.provider.getBalance(addressStore.deployer.address),
      );
      expect(tx2).to.be.greaterThan(deployeerEthBal);
    });
  });

  describe("💡 WETH to ETH Withdraw", () => {
    let WETHBal: BigNumberish | Typed;

    it("🧪 Should show WETH balance == 1", async () => {
      const wethImpersonater = await ethers.getImpersonatedSigner(
        productionChainImpersonators[forkedChain]?.weth as string,
      );
      const impersonatedWeth = await connectToErc20(
        tokenAddress.weth![forkedChain]! as string,
        wethImpersonater,
      );

      await impersonatedWeth.transfer(
        addressStore.deployer.address,
        ethers.parseUnits("1", 18),
      );

      WETHBal = await wethContract.balanceOf(addressStore.deployer.address);
      expect(WETHBal).to.equal(ethers.parseUnits("1", 18));
    });

    it("🧪 Should Withdraw ETH directly from WETH contract", async () => {
      const ETHBal = Number(
        await ethers.provider.getBalance(addressStore.deployer.address),
      );

      const tx = await wethContract
        .connect(addressStore.deployer.signer)
        .withdraw(ethers.parseUnits("1", 18));

      await expect(tx.wait()).to.be.fulfilled;
      expect(tx)
        .to.emit(wethContract, "Withdrawal")
        .with(
          addressStore.deployer.address as string,
          ethers.parseUnits("1", 18).toString(),
        );

      const ETHBal2 = Number(await ethers.provider.getBalance(swapTest.target));
      expect(ETHBal2).to.equal(ETHBal + Number(ethers.parseUnits("1", 18)));
    });

    it("🧪 Should withdraw ETH", async () => {
      WETHBal = await wethContract.balanceOf(swapTest.target);
      const ETHBal = Number(await ethers.provider.getBalance(swapTest.target));
      const tx = await swapTest.withdrawETH(WETHBal);
      await expect(tx.wait()).to.be.fulfilled;
      const tx2 = Number(await ethers.provider.getBalance(swapTest.target));
      expect(tx2).to.be.greaterThan(ETHBal);
      await expect(tx)
        .to.emit(wethContract, "Withdrawal")
        .withArgs(swapTest.target, WETHBal);
    });
  });
});
