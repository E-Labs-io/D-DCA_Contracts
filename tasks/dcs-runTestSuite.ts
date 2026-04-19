/** @format */
import { task } from "hardhat/config";

const taskId = "runTestSuit";

task(taskId, "Run the specific test suite on DCA COntracts").setAction(
  async (_args, hre) => {
    console.log(`🟢 [TASK] ${taskId} : Mounted`);

    //  Verify the contract
    await hre.run("test", [
      "./test/accountFactory.test.ts",
      "./test/account.test.ts",
      "./test/reinvestModual.test.ts",
    ]);
  },
);
