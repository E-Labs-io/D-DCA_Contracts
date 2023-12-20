/** @format */

import { ChainName } from "./tokenAddress";

const deployedDCAContracts: {
  [chain in ChainName]?: { [name in ContractNames]?: string };
} = {
  ethGoerli: {
    DCAReinvest: "0x67864895cBCD6Ae426f816cA09ee6BecAE162d10",
    DCAExecutor: "0x6b74186415C1343BdBB72B6EAc40A104904A572F",
    DCAFactory: "0x9297251091b9D7926E6f1fc37895Fe5c0aBaD66B",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest";
export default deployedDCAContracts;
