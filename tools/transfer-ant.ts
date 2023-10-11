import Arweave from "arweave";
import {
  defaultCacheOptions,
  LoggerFactory,
  WarpFactory,
} from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { keyfile } from "./constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The recipient target of the token transfer
  const target = "31LPFYoow2G7j-eSSsrIh8OlNaARZ84-80J-8ba68d8";

  // This is the Arweave Name Token Contract TX ID that will be transferred
  const antRecordContractTxId = "lXQnhpzNXN0vthWm3sZwE2z7E_d3EWALe5lZPruCOD4";
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Initialize Arweave
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  // Initialize `LoggerFactory`
  LoggerFactory.INST.logLevel("error");

  // Initialize Warp
  const warp = WarpFactory.forMainnet(
    {
      ...defaultCacheOptions,
      inMemory: true,
    },
    true
  );

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString()
  );
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Read the ANT Registry Contract
  console.log(
    "Transfering %s ANT from %s to %s",
    antRecordContractTxId,
    walletAddress,
    target
  );
  const pst = warp.pst(antRecordContractTxId);
  pst.connect(wallet);
  const transferTxId = await pst.transfer({
    target,
    qty: 1,
  });

  console.log(`Finished transferring tokens via txID ${transferTxId}`);
})();
