/** @format */

import { ChainName } from "./tokenAddress";

const deployedDCAContracts: {
  [chain in ChainName]?: { [name in ContractNames]?: string };
} = {
  ethGoerli: {
    DCAReinvest: "0x67864895cBCD6Ae426f816cA09ee6BecAE162d10",
    DCAExecutor: "0x0AAe76B53416022Aed7626C8a962ad417a010B5B",
    DCAFactory: "0x83A6B5e55A97F25fB7a279E40Afa8b85eD6fc655",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest";
export default deployedDCAContracts;
