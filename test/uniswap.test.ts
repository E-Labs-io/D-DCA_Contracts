import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { AbiCoder, AddressLike, ZeroAddress } from "ethers";
import { DCAAccount, IERC20 } from "~/types/contracts";
import signerStore, { SignerStore } from "~/scripts/tests/signerStore";

import { productionChainImpersonators, tokenAddress } from "~/bin/tokenAddress";

import { ISwapRouter__factory } from "../types/contracts/factories/contracts/protocols/uniswap/ISwapRouterv3.sol";
import { ISwapRouter } from "~/types/contracts";
import deploymentConfig from "~/bin/deployments.config";
import {
  checkEthBalanceAndTransfer,
  connectToErc20,
} from "~/scripts/tests/contractInteraction";

import { resetFork } from "~/scripts/tests/forking";

describe("> Uniswap Tests Tests", () => {
  console.log("🧪 Uniswap Tests : Mounted");

  const forkedChain = deploymentConfig().masterChain;
  const abiEncoder: AbiCoder = AbiCoder.defaultAbiCoder();

  let swapParams: ISwapRouter.ExactInputSingleParamsStruct;

  let usdcContract: IERC20;
  let wethContract: IERC20;

  let createdAccount: DCAAccount;
  let addressStore: SignerStore;
  let swapRouter: ISwapRouter;

  before(async function () {
    await resetFork(hre);
    await preTest();
  });

  async function preTest() {
    addressStore = await signerStore(ethers, ["deployer"]);

    // SWAP ROUTER
    swapRouter = (await ethers.getContractAt(
      [...ISwapRouter__factory.abi],
      tokenAddress.swapRouter![forkedChain]! as string,
      addressStore.deployer.signer,
    )) as unknown as ISwapRouter;

    // USDC
    const usedImpersonater = await ethers.getImpersonatedSigner(
      productionChainImpersonators[forkedChain]?.usdc as string,
    );
    usdcContract = await connectToErc20(
      tokenAddress?.usdc?.[forkedChain]! as string,
      usedImpersonater,
    );

    await checkEthBalanceAndTransfer(
      productionChainImpersonators[forkedChain]?.usdc as string,
      addressStore.deployer.signer,
      { amount: ethers.parseEther("2"), force: true },
    );

    const tx = await usdcContract.transfer(
      addressStore.deployer.address,
      ethers.parseUnits("20000", 6),
    );
    await tx.wait();

    //  WETH
    wethContract = await connectToErc20(
      tokenAddress?.weth?.[forkedChain]! as string,
      addressStore.deployer.signer,
    );

    const block = await hre.ethers.provider.getBlock("latest");
    swapParams = {
      tokenIn: tokenAddress.usdc![forkedChain]!,
      tokenOut: tokenAddress.weth![forkedChain]!,
      fee: 10000,
      recipient: addressStore.deployer.address,
      amountIn: ethers.parseUnits("1000", 6),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
  }

  describe("💡 Deploy and State Checks", () => {
    //  Deploy the Factory
    it("🧪 Should deploy the contract", async () => {
      const factoryFactory = await ethers.getContractFactory(
        "DCAAccount",
        addressStore.deployer.signer,
      );

      createdAccount = await factoryFactory.deploy(
        ZeroAddress,
        tokenAddress.swapRouter![forkedChain]!,
        addressStore.deployer.address,
        ZeroAddress,
      );
      await createdAccount.waitForDeployment();
      createdAccount = createdAccount.connect(addressStore.deployer.signer);
      expect(createdAccount.target).to.not.equal(ZeroAddress);
    });

    it("🧪 Should have the correct owner", async () => {
      const owner = await createdAccount.owner();
      expect(owner).to.equal(addressStore.deployer.address);
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
  });

  describe("💡 Check balances & Allowances", () => {
    it("🧪 Should show 0 WETH balance", async () => {
      const tx = await wethContract.balanceOf(addressStore.deployer.address);
      expect(tx).to.equal(0);
    });
    it("🧪 Should return the USDC balance of account $20000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);
      const tx = await contract.balanceOf(addressStore.deployer.address);
      expect(tx).to.equal(ethers.parseUnits("20000", 6));
    });
  });

  describe("💡 Test Swap directly on Router", () => {
    it("🧪 Should return the WETH address", async () => {
      const weth9Address = await swapRouter.WETH9();
      expect(weth9Address).to.equal(tokenAddress.weth![forkedChain]);
    });

    it("🧪 Should revert a USDC > WETH trade - Not spend approved", async () => {
      await expect(swapRouter.exactInputSingle(swapParams)).to.be.revertedWith(
        "STF",
      );
    });

    it("🧪 Should approve the swaprouter to spend USDC", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract.approve(
        tokenAddress.swapRouter![forkedChain] as AddressLike,
        ethers.parseUnits("1000", 6),
      );
      await expect(tx.wait()).to.be.fulfilled;
    });

    it("🧪 Should show swapRouter allowance of $1000", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);

      const tx = await contract?.allowance(
        addressStore.deployer.address as AddressLike,
        tokenAddress.swapRouter![forkedChain] as AddressLike,
      );
      expect(tx).to.equal(ethers.parseUnits("1000", 6));
    });

    it("🧪 Should execute a USDC > WETH trade", async () => {
      const tx = await swapRouter.exactInputSingle(swapParams);
      await expect(tx.wait()).to.be.fulfilled;
      const bal = await wethContract.balanceOf(addressStore.deployer.address);
      expect(bal).to.greaterThanOrEqual(1);
    });
  });

  describe("💡 Execute a SWAP test", () => {
    it("🧪Should transfer USDC to account", async () => {
      const contract = usdcContract.connect(addressStore.deployer.signer);
      await expect(
        contract.transfer(createdAccount.target, ethers.parseUnits("1000", 6)),
      ).to.be.fulfilled;
    });
  });

  describe("💡 Execute a ERC20-ETH SWAP test", () => {
    let oldBalance = 0;

    it("🧪Should get the ETH balance of the account", async function () {
      oldBalance = await checkEthBalanceAndTransfer(
        createdAccount.target as string,
        addressStore.deployer.signer,
        { topUpTo: 1 },
      );

      expect(oldBalance >= 1).to.be.true;
    });
    it("🧪Should transfer USDC to account", async function () {
      await expect(
        usdcContract.transfer(
          createdAccount.target,
          ethers.parseUnits("100", 6),
        ),
      ).to.be.fulfilled;
    });

    it("🧪Should get the new ETH balance of the account", async function () {
      const newBalance = await checkEthBalanceAndTransfer(
        createdAccount.target as string,
        addressStore.deployer.signer,
        { justBalance: true },
      );

      expect(newBalance > oldBalance).to.be.true;
    });
  });
});
