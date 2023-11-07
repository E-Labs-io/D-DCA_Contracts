/** @format */

import { Addressable } from "ethers";
import hardhat from "hardhat";

async function verifyContractOnScan(
  contractAddress: string | Addressable,
  args: any[]
) {
  console.log("🟡 Starting Contract Verification");
  await hardhat
    .run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
    .then(() => console.log("🟢 Scan Verified "));
}

export default verifyContractOnScan;
