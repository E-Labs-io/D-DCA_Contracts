
import dotenv from "dotenv";
import { Network } from "ethers";
dotenv.config();


export default function checkPrivateKeys(){
   
 
    if (!process.env.PRIVATE_DEV_KEY) {
        console.log("🛑 Private key not found.");
    throw "No Private Keys";
    } 
    console.log("🟢 Private key found.");

    const masterMnemonic = `0x${process.env.PRIVATE_DEV_KEY}`;
    const rcpEndPoints = {
        baseGoerli: `https://base-goerli.public.blastapi.io`,
        mumbai: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        polygon: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        homestead: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        sepolia: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        optimism: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        opGoerli: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    };

  return { masterMnemonic, rcpEndPoints}

}

