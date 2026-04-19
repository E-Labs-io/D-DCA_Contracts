/** @format */

import { Addressable, Network } from "ethers";
import * as fs from "fs";
//import { Network } from "hardhat/types";
import * as path from "path";

type Deployment = {
  timestamp: string;
  contractName: string;
  contractAddress: string | Addressable;
  deployerAddress: string | Addressable;
  network: Network;
};

export default function logDeployment(
  contractName: string,
  contractAddress: string | Addressable,
  deployerAddress: string | Addressable,
  network: Network
) {
  const logPath = path.join(__dirname, "../logs/deployments.logs.json");
  const timestamp = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const newLog: Deployment = {
    timestamp: timestamp,
    contractName: contractName,
    contractAddress: contractAddress,
    deployerAddress: deployerAddress,
    network,
  };

  let logs: Deployment[] = [];

  // Check if file exists
  if (fs.existsSync(logPath)) {
    const existingLogs = fs.readFileSync(logPath, "utf-8");
    logs = existingLogs
      ? Array.isArray(JSON.parse(existingLogs))
        ? JSON.parse(existingLogs)
        : []
      : [];
  }

  // Add new log to the start of the array
  logs.unshift(newLog);

  // Save the updated logs
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}
