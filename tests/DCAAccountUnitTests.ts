/** @format */

import { expect } from "chai";
import { ethers } from "hardhat";
import { DCAAccount } from "../types/contracts";
import {
  DCAAccountArguments,
  newStrat,
} from "~/deployments/deploymentArguments/DCA.arguments";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { IDCADataStructures } from "~/types/contracts/contracts/DCAExecutor";

describe("DCAAccount Contract", function () {
  let dcaAccount: any;
  let owner: HardhatEthersSigner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy DCAAccount contract with standard deployment data
    const DCAAccountFactory = await ethers.getContractFactory("DCAAccount");
    const dcaAccountArgs = DCAAccountArguments(owner.address, "hardhat");
    dcaAccount = await DCAAccountFactory.deploy(
      dcaAccountArgs[0],
      dcaAccountArgs[1],
      dcaAccountArgs[2]
    );
    await dcaAccount.deployed();
  });

  describe("SetupStrategy", function () {
    it("Should set up a new strategy correctly", async function () {
      const strategyData: IDCADataStructures.StrategyStruct = newStrat(
        owner.address,
        "hardhat"
      );

      await expect(dcaAccount.SetupStrategy(strategyData, 1000, false))
        .to.emit(dcaAccount, "NewStrategyCreated")
        .withArgs(strategyData.strategyId);

      // Get strategy data and validate
      const storedStrategy = await dcaAccount.getStrategyData(
        strategyData.strategyId
      );
      expect(storedStrategy.accountAddress).to.equal(owner.address);
      expect(storedStrategy.baseToken.tokenAddress).to.equal(
        strategyData.baseToken.tokenAddress
      );
      // Add additional checks for other strategy fields
    });

    it("Should fund the account correctly", async function () {
      const strategyData: IDCADataStructures.StrategyStruct = newStrat(
        owner.address,
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
