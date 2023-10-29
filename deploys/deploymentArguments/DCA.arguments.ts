/** @format */

import { AddressLike, Addressable, ZeroAddress } from "ethers";
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


export const newStrat:IDCADataStructures.StrategyStruct = {
    accountAddress: "0x00C394eFDBbc759336AACD5050F1771B4a441B3A",
    baseToken: {
        tokenAddress: "0xd513E4537510C75E24f941f159B7CAFA74E7B3B9",
        decimals: 6,
        ticker: "USDC"
    },
    targetToken: {
        tokenAddress: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
        decimals: 18,
        ticker: "AETH"
    },
    interval: 0,
    amount: 10000000,
    reinvest: false,
    active: false,
    revestContract: '0x0000000000000000000000000000000000000000',
    strategyId: 0,
}