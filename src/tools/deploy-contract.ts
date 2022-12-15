import Arweave from "arweave";
import {
  defaultCacheOptions,
  LoggerFactory,
  PstState,
  WarpFactory,
} from "warp-contracts";
import * as fs from "fs";
import path from "path";
import { keyfile } from "../constants";

(async () => {
  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

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
  const wallet = JSON.parse(await fs.readFileSync(keyfile).toString());
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // ~~ Read contract source and initial state files ~~
  const contractSrc = fs.readFileSync(
    path.join(__dirname, "../../dist/contract.js"),
    "utf8"
  );
  const stateFromFile: PstState = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../dist/contracts/initial-state.json"),
      "utf8"
    )
  );
  const initialState: PstState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
      controller: walletAddress,
    },
    balances: {
      [walletAddress]: 1,
    },
  };

  // ~~ Deploy contract ~~
  const contractTxId = await warp.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  // ~~ Log contract id to the console ~~
  console.log("Mainnet Contract TxId %s", contractTxId);
})();
