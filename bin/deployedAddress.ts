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
    DCAAccount: "0x7Cd808FD059e61d5F204f80048C6050dd58Cb237",
    DCAExecutor: "0xE23c2A57B66c54e940b32beFb15aE3E6774ef184",
    DCAReinvest: "0x38aefD6fcc17Fe0EEE5090257FA72681b9214853",
    DCAFactory: "0xf62347eAEF2ADCbC2F0067DD5FC90EAE1EDDC094",
    DCAReinvestProxy: "0x38aefD6fcc17Fe0EEE5090257FA72681b9214853",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest"
  | "DCAReinvestProxy";
export default deployedDCAContracts;
