/** @format */

import { ChainName } from "./tokenAddress";

const deployedDCAContracts: {
  [chain in ChainName]?: { [name in ContractNames]?: string };
} = {
  ethGoerli: {
    DCAReinvest: "0x67864895cBCD6Ae426f816cA09ee6BecAE162d10",
    DCAExecutor: "0x22DE15E76a05ec1863D27c2d7F6eDE870e24553d",
    DCAFactory: "0xbb639096875855fA18a228731504037ed9Fc707E",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest";
export default deployedDCAContracts;
