/** @format */

import { Addressable } from "ethers";
import { RunTaskFunction } from "hardhat/types";

async function verifyContractOnScan(
  run: RunTaskFunction,
  contractAddress: string | Addressable,
  args: any[]
) {
  console.log("🟡 Starting Contract Verification");
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args,
  }).then(() => console.log("🟢 Scan Verified "));
}

export default verifyContractOnScan;
