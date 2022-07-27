import Arweave from "arweave";
import { LoggerFactory, WarpNodeFactory } from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { keyfile } from "../constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The subdomain to add or update
  const subDomainToUpdate = "shroom_sub_domain";

  // The Time To Live for this ANT to reside cached, the default and minimum is 900 seconds
  const newTtlSeconds = 3600;

  // The arweave data transaction that is to be proxied using this subdomain
  const txIdToUpdate = "KmCzrswTGzRTSzNx2oyke2M_x6mSUf5jIOvyItGOnkg";

  // This is the Arweave Name Token Contract TX ID that will have a subdomain added/modified
  const contractTxId = "4FftM3u83NKE4taZcIO2Kd8O4IMrOcLmhuOzq9Kv1fk";
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize SmartWeave ~~
  const smartweave = WarpNodeFactory.memCached(arweave);

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(fs.readFileSync(keyfile).toString());

  // ~~ Read contract source and initial state files ~~
  const pst = smartweave.pst(contractTxId);
  pst.connect(wallet);
  const swTxId = await pst.writeInteraction({
    function: "setRecord",
    subDomain: subDomainToUpdate,
    ttlSeconds: newTtlSeconds,
    transactionId: txIdToUpdate,
  });

  console.log(
    `Updating ANT "${contractTxId}"'s subdomain "${subDomainToUpdate}" value to "${txIdToUpdate}" at txID ${swTxId}`
  );
})();
