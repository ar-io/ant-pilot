import Arweave from "arweave";
import {
  defaultCacheOptions,
  LoggerFactory,
  WarpFactory,
} from "warp-contracts";
import * as fs from "fs";
import { keyfile } from "../constants";
import { deployedContracts } from "../deployed-contracts";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // A short token symbol, typically with ANT- in front
  const ticker = "ANT-GENESIS";

  // A friendly name for the name of this token
  const name = "BT: Genesis";

  // The Time To Live for this ANT to reside cached, the default and minimum is 900 seconds
  const ttlSeconds = 900;

  // The arweave data transaction that is to be proxied using the registered name
  const dataPointer = "C6IyOj4yAaJPaV8KuOG2jdf4gQCmpPisuE3eAUBdcUs";
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // This is the ANT Smartweave Contract Source TX ID that will be used to create the new ANT
  const antRecordContractTxId = deployedContracts.sourceTxId;

  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: "arweave.net",
    timeout: 600000,
    port: 443,
    protocol: "https",
  });

  // Initialize `LoggerFactory`
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize Warp ~~
  const warp = WarpFactory.forMainnet(
    {
      ...defaultCacheOptions,
      inMemory: true,
    },
    true
  );

  // ~~ Generate Wallet and add funds ~~
  // const wallet = await arweave.wallets.generate();
  // const walletAddress = await arweave.wallets.jwkToAddress(wallet);
  const wallet = JSON.parse(await fs.readFileSync(keyfile).toString());
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Create the initial state
  const initialState = {
    ticker: ticker,
    name,
    owner: walletAddress,
    controller: walletAddress,
    evolve: null,
    records: {
      "@": {
        transactionId: dataPointer,
        ttlSeconds: ttlSeconds,
      },
    },
    balances: {
      [walletAddress]: 1,
    },
  };

  // ~~ Deploy contract ~~
  console.log("Creating ANT for %s", name);
  const contractTxId = await warp.deployFromSourceTx({
    wallet,
    initState: JSON.stringify(initialState),
    srcTxId: antRecordContractTxId,
  });

  // ~~ Log contract id to the console ~~
  console.log("Mainnet Contract id %s", contractTxId);
})();
