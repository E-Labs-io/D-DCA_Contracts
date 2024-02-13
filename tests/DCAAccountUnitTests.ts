/** @format */

import { expect } from "chai";
import { ethers } from "hardhat";
import { DCAAccount } from "../types/contracts";
import {
  DCAAccountArguments,
  newStrat,
} from "~/deploy/deploymentArguments/DCA.arguments";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { IDCADataStructures } from "~/types/contracts/contracts/DCAExecutor";

describe("DCAAccount Contract", function () {
  let dcaAccount: any;
  let deployer: HardhatEthersSigner, addr1;



  

  beforeEach(async function () {
    [deployer, addr1] = await ethers.getSigners();

    // Deploy DCAAccount contract with standard deployment data
    const DCAAccountFactory = await ethers.getContractFactory("DCAAccount");
    const dcaAccountArgs = DCAAccountArguments(deployer.address, "hardhat");
    dcaAccount = await DCAAccountFactory.deploy(
      dcaAccountArgs[0],
      dcaAccountArgs[1],
      dcaAccountArgs[2],
      dcaAccountArgs[3],
      dcaAccountArgs[4],
    );
    await dcaAccount.deployed();
  });

  describe("SetupStrategy", function () {
    it("Should set up a new strategy correctly", async function () {
      const strategyData: IDCADataStructures.StrategyStruct = newStrat(
        deployer.address,
        "hardhat"
      );

      await expect(dcaAccount.SetupStrategy(strategyData, 1000, false))
        .to.emit(dcaAccount, "NewStrategyCreated")
        .withArgs(strategyData.strategyId);

      // Get strategy data and validate
      const storedStrategy = await dcaAccount.getStrategyData(
        strategyData.strategyId
      );
      expect(storedStrategy.accountAddress).to.equal(deployer.address);
      expect(storedStrategy.baseToken.tokenAddress).to.equal(
        strategyData.baseToken.tokenAddress
      );
      // Add additional checks for other strategy fields
    });

    it("Should fund the account correctly", async function () {
      const strategyData: IDCADataStructures.StrategyStruct = newStrat(
        deployer.address,
        "hardhat"
      );
      await dcaAccount.SetupStrategy(strategyData, 1000, false);

      const fundingAmount = ethers.parseUnits("1000", "ether");
      await expect(
        dcaAccount.FundAccount(
          strategyData.baseToken.tokenAddress,
          fundingAmount
        )
      )
        .to.emit(dcaAccount, "AccountFunded") // Assuming this event exists
        .withArgs(strategyData.baseToken.tokenAddress, fundingAmount);

      const balance = await dcaAccount.getBaseBalance(
        strategyData.baseToken.tokenAddress
      );
      expect(balance).to.equal(fundingAmount);
    });
  });
});
