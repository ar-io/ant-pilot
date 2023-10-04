import Arweave from "arweave";
import { LoggerFactory, PstState, WarpFactory } from "warp-contracts";
import * as fs from "fs";
import path from "path";
import { addFunds } from "../../utils/_helpers";
import { testKeyfile } from "./constants";

(async () => {
  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    timeout: 600000,
    port: 443,
    protocol: "https",
  });

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize Warp ~~
  const warp = WarpFactory.forTestnet();

  // ~~ Generate Wallet and add funds ~~
  // const wallet = await arweave.wallets.generate();
  // const walletAddress = await arweave.wallets.jwkToAddress(wallet);
  const wallet = JSON.parse(await fs.readFileSync(testKeyfile).toString());
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);
  await addFunds(arweave, wallet);

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
  console.log("Testnet Contract id %s", contractTxId);
})();
