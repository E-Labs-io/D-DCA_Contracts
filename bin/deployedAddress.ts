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
    DCAAccount: "0xA0d60fe053315e471c56084ECcF5DFFEba3c33C0",
    DCAExecutor: "0xe3B4028292C9F2b39B853C2510EaD01543330b2C",
    DCAReinvest: "0x7c775404d013951c22EC1e59C021C9b1376Fd7c4",
    DCAFactory: "0xE8263B3dcAC163826E846b0Ee4540674ED1880Ec",
    DCAReinvestProxy: "0x7c775404d013951c22EC1e59C021C9b1376Fd7c4",
  },
  maticMumbai: {
    DCAAccount: "0x3D81B5f5F04590cDBa6f2C6F75B6684e0a13d8B2",
    DCAExecutor: "0xa780fb1fd71F87162B1700db18b2776769499589",
    DCAReinvest: "0xB44D215D8bd515A7499d6F77a93314C341d4B766",
    DCAFactory: "0x90107ADc242C003c0C142E315650f31D9B985C3D",
    DCAReinvestProxy: "0xB44D215D8bd515A7499d6F77a93314C341d4B766",
  },
};

export type ContractNames =
  | "DCAAccount"
  | "DCAExecutor"
  | "DCAFactory"
  | "DCAReinvest"
  | "DCAReinvestProxy";
export default deployedDCAContracts;
