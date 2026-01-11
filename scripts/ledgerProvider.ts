import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import AppEth from "@ledgerhq/hw-app-eth";
import { ethers } from "ethers";

export async function getLedgerSigner(
  rpcUrl: string,
  walletIndex = 0,
  mode: "metamask" | "ledgerlive" = "metamask",
) {
  // Determine path
  let derivationPath: string;
  if (mode === "metamask") {
    derivationPath = `m/44'/60'/0'/0/${walletIndex}`;
  } else if (mode === "ledgerlive") {
    derivationPath = `m/44'/60'/${walletIndex}'/0/0`;
  } else {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  // Connect to Ledger
  const transport = await TransportNodeHid.create();
  const eth = new AppEth(transport);

  // Get address
  const { address } = await eth.getAddress(derivationPath, false, true);
  console.log(`🟢 Ledger address: ${address}`);

  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Custom signer
  class LedgerSigner extends ethers.AbstractSigner {
    constructor(provider: ethers.Provider) {
      super(provider);
    }

    async getAddress(): Promise<string> {
      return address;
    }

    connect(provider: ethers.Provider): LedgerSigner {
      return new LedgerSigner(provider);
    }

    async signTransaction(tx: ethers.TransactionRequest): Promise<string> {
      const populated = await this.populateTransaction(tx);
      // Remove 'from' field for unsigned transaction
      const { from, ...unsignedData } = populated;
      const unsignedTx = await ethers.Transaction.from(unsignedData);
      const unsignedSerialized = unsignedTx.unsignedSerialized;

      const sig = await eth.signTransaction(
        derivationPath,
        unsignedSerialized.slice(2),
      );

      const signature = {
        v: parseInt(sig.v, 16),
        r: "0x" + sig.r,
        s: "0x" + sig.s,
      };

      // Use unsignedData (without 'from') for the final transaction
      const signedTx = ethers.Transaction.from(unsignedData);
      signedTx.signature = signature;
      return signedTx.serialized;
    }

    async signMessage(): Promise<string> {
      throw new Error("Message signing not implemented");
    }

    async signTypedData(): Promise<string> {
      throw new Error("Typed data signing not implemented");
    }
  }

  const signer = new LedgerSigner(provider);

  return { signer, transport };
}
