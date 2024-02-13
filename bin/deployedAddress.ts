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
  opGoerli: {
    DCAAccount: "",
    DCAExecutor: "0x3538F2e6eEFdC499E54635d60B7884C3f9E7D760",
    DCAReinvest: "0x125226D875FE3457900a70c3863835205e4c57F5",
    DCAFactory: "0x05B45a4EA7dB5dc72c1a9089cD9D2FF4612308BA",
    DCAReinvestProxy: "0x125226D875FE3457900a70c3863835205e4c57F5",
  },
  ethSepolia: {
    DCAAccount: "0x1754A81a6b9fdC90E1aA32fC84be76372D9D9ad4",
    DCAExecutor: "0x528cD9f6d03990DA7DE66FF12A482F64724f6198",
    DCAReinvest: "0xC8A4D5A59D5D603c2036e9c46B5CaB336669e3E0",
    DCAFactory: "0x336a760537DCFAcDaDFFa31079989d6d3ADF0607",
    DCAReinvestProxy: "0xC8A4D5A59D5D603c2036e9c46B5CaB336669e3E0",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest"
  | "DCAReinvestProxy";
export default deployedDCAContracts;
