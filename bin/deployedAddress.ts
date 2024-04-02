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
    DCAAccount: "0xce6397cFDdA3ED6396c02967b14a00e35c7a00d1",
    DCAExecutor: "0xa2b8a19a8a10C2fde3337CC64827C43c8E838541",
    DCAReinvest: "0xF3A175F048Bb83f5F519a251628dBa123DE7DB77",
    DCAFactory: "0xbc25BbbFEb33a5B475E557D7cFDC0b35e3A5b538",
    DCAReinvestProxy: "",
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
