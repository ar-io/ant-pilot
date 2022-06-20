import Arweave from "arweave";
import { LoggerFactory, WarpNodeFactory } from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { keyfile } from "../constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const subDomainToUpdate = "@";
  const txIdToUpdate = "CZP1Lh527KLYYL6LxPjYNFO-hXGvajtE8y_iAi0BDgs";
  const contractTxId = "XJnC9jPXpwAvrNnmeYYo69I6RrSf9MNabGDGaQws8dQ";
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
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString()
  );

  // ~~ Read contract source and initial state files ~~
  const pst = smartweave.pst(contractTxId);
  pst.connect(wallet);
  await pst.writeInteraction({
    function: "setRecord",
    subDomain: subDomainToUpdate,
    transactionId: txIdToUpdate,
  });
})();
