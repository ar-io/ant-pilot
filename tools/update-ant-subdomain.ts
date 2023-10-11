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
  // The subdomain to add or update
  const subDomainToUpdate = "logo";

  // The Time To Live for this ANT to reside cached, the default and minimum is 900 seconds
  const newTtlSeconds = 3600;

  // The arweave data transaction that is to be proxied using this subdomain
  const txIdToUpdate = "KKmRbIfrc7wiLcG0zvY1etlO0NBx1926dSCksxCIN3A";

  // This is the Arweave Name Token Contract TX ID that will have a subdomain added/modified
  const contractTxId = "bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM";
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize Warp ~~
  const warp = WarpFactory.forMainnet(
    {
      ...defaultCacheOptions,
      inMemory: true,
    },
    true
  );

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(fs.readFileSync(keyfile).toString());

  // ~~ Read contract source and initial state files ~~
  const pst = warp.pst(contractTxId);
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
