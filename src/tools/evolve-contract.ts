import {
  defaultCacheOptions,
  LoggerFactory,
  WarpFactory,
} from "warp-contracts";
import * as fs from "fs";
import path from "path";
import { JWKInterface } from "arweave/node/lib/wallet";
// import { deployedContracts } from "../deployed-contracts";
import { keyfile } from "../constants";

(async () => {
  // This is the mainnetANT Smartweave Contract TX ID version
  const antContractTxId = "qVZ3O7Ng0prSdGh7_xSa7OiffSYTnntWUPap0Uo0OoM";

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize SmartWeave ~~
  const warp = WarpFactory.forMainnet(
    {
      ...defaultCacheOptions,
      inMemory: true,
    },
    true
  );

  // Get the key file used
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString()
  );

  // Read the ArNS Registry Contract
  const pst = warp.pst(antContractTxId);
  pst.connect(wallet);
  // ~~ Read contract source and initial state files ~~
  const newSource = fs.readFileSync(
    path.join(__dirname, "../../dist/contract.js"),
    "utf8"
  );

  const evolveSrcTx = await warp.createSourceTx({ src: newSource }, wallet);
  const evolveSrcTxId = await warp.saveSourceTx(evolveSrcTx);
  if (evolveSrcTxId === null) {
    return 0;
  }
  const evolveTx = await pst.writeInteraction({
    function: "evolve",
    value: evolveSrcTxId,
    version: "0.1.0",
  });

  console.log(
    "Finished evolving the ArNS Smartweave Contract %s with TX %s.",
    antContractTxId,
    evolveTx.originalTxId
  );
})();
