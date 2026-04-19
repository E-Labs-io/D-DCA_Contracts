import { AbiCoder, AddressLike, Addressable, Contract, Signer } from "ethers";
import { expect, assert } from "chai";
import hre, { ethers } from "hardhat";
import { HardhatEthersHelpers } from "hardhat/types";

export interface SignerStore {
  [wallet: string]: { address: string | Addressable; signer: Signer };
}

async function signerStore(
  ethers: HardhatEthersHelpers,
  names: string[],
): Promise<SignerStore> {
  const signers = await ethers.getSigners();
  const store: SignerStore = {};

  names.forEach(async (name, index) => {
    const address = await signers[index].getAddress();
    store[name] = {
      address: address,
      signer: signers[index],
    };
  });

  return store;
}

export default signerStore;
