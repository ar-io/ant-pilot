import { LoggerFactory, WarpFactory } from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { testKeyfile } from "../constants";

(async () => {
  // This is the testnet ANT Smartweave Contract TX ID
  const antContractTxId = "ddFhy9E3P364rW5AxPJ2U1u5hPrNW1A0NOkxb4FwL9w";

  // ~~ Initialize warp ~~
  LoggerFactory.INST.logLevel("error");
  const warp = WarpFactory.forTestnet();

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(testKeyfile).toString()
  );

  // Read the ANT Registry Contract
  const pst = warp.pst(antContractTxId);
  pst.connect(wallet);
  const currentState = await pst.currentState();
  const currentStateString = JSON.stringify(currentState);
  const currentStateJSON = JSON.parse(currentStateString);
  console.log(currentStateJSON);
  console.log(
    "Finished getting the test ArNS state for the registry: %s",
    antContractTxId
  );
})();
