import Arweave from "arweave";
import { LoggerFactory, WarpNodeFactory } from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { keyfile } from "../constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const subDomainToUpdate = "shroom_sub_domain";
  const newTtlSeconds = 900 // This is the name that will be purchased in the Arweave Name System Registry
  const txIdToUpdate = "KmCzrswTGzRTSzNx2oyke2M_x6mSUf5jIOvyItGOnkg";
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
