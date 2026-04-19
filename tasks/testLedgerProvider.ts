import { task } from "hardhat/config";
import { getLedgerSigner } from "../scripts/ledgerProvider";

task("ledger-wallets", "Tests Ledger signer provider")
  .addOptionalParam("index", "Wallet index", "0")
  .addOptionalParam(
    "mode",
    "Derivation mode (metamask | ledgerlive)",
    "metamask",
  )
  .setAction(async (taskArgs) => {
    console.log(`🟢 Hardhat : Mounted.`);

    const rpcUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY"; // replace

    try {
      const { signer, transport } = await getLedgerSigner(
        rpcUrl,
        2,
        "ledgerlive",
      );
      const addr = await signer.getAddress();
      console.log(`🔹 Ledger address from provider: ${addr}`);

      console.log(`✅ Ledger signer provider tested successfully.`);

      await transport.close();
      console.log(`🛑 Ledger transport closed.`);
    } catch (err) {
      console.error(`❌ Error:`, err);
    }
  });
