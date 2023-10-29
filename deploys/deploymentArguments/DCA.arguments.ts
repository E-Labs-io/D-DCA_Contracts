/** @format */

import { AddressLike, Addressable } from "ethers";
import { IDCADataStructures } from "../../types/contracts/contracts/DSAExecutor";


export function DCAExecutorArguments(deployer: string | Addressable) :any[] {
    const feeDistrobution_: IDCADataStructures.FeeDistributionStruct = {
        amountToAdmin: 20,      //  20%
        amountToComputing: 4500,//  45%
        amountToExecutor: 3500, //  35%
        feeAmount: 20,          //  0.2%
        executionAddress: '0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1',
        computingAddress: "0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1",
        adminAddress: '0x8414FDEd1f0033fDfBD87206d69723f2EE72dde1'
    }   
    const  executionEOA_: AddressLike = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    return [feeDistrobution_, executionEOA_]

}


export function DCAAccountArguments(deployer: string | Addressable): any[] {
    const executorAddress_: AddressLike = "";
    const swapRouter_: AddressLike = "0xE592427A0AEce92De3Edee1F18E0157C05861564"


    return [executorAddress_, swapRouter_]

}