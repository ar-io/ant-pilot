import Arweave from "arweave";
import {
  defaultCacheOptions,
  LoggerFactory,
  WarpFactory,
} from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { deployedContracts } from "../deployed-contracts";
import { keyfile } from "../constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // A short token symbol, typically with ANT- in front
  const ticker = "ANT-COMBO";

  // A friendly name for the name of this ANT
  const name = "Combo Name Buy";

  // This is the name that will be purchased in the Arweave Name System Registry
  const nameToBuy = "combo-name-buy";

  // The lease time for purchasing the name
  const years = 1;

  // the Tier of the name purchased.  Tier 1 = 100 subdoins, Tier 2 = 1000 subdomains, Tier 3 = 10000 subdomains
  const tier = 1;

  // The Time To Live for this ANT to reside cached, the default and minimum is 900 seconds
  const ttlSeconds = 1800;

  // The arweave data transaction added to the ANT that is to be proxied using the registered name
  const dataPointer = "xWQ7UmbP0ZHDY7OLCxJsuPCN3wSUk0jCTJvOG1etCRo";

  // This is the production ArNS Registry Smartweave Contract
  const arnsRegistryContractTxId =
    // "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U"; 0.1.5 arns pilot
    "R-DRqVv97e8cCya95qsH_Tpvmb9vidURYWlBL5LpSzo"; // 0.1.7 contract
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // This is the ANT Smartweave Contract Source TX ID that will be used to create the new ANT
  const antRecordContractTxId = deployedContracts.sourceTxId;

  // Initialize Arweave
  const arweave = Arweave.init({
    host: "arweave.net",
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

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString()
  );
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Read the ANT Registry Contract
  const pst = warp.pst(arnsRegistryContractTxId);
  pst.connect(wallet);

  // check if this name exists in the registry, if not exit the script.
  const currentState = await pst.currentState();
  const currentStateString = JSON.stringify(currentState);
  const currentStateJSON = JSON.parse(currentStateString);
  if (currentStateJSON.records[nameToBuy] !== undefined) {
    console.log(
      "This name %s is already taken and is not available for purchase.  Exiting.",
      nameToBuy
    );
    return;
  }
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

  // Deploy ANT Contract in order to link to the new record
  console.log(
    "Creating ANT for %s using sourceTx",
    name,
    antRecordContractTxId
  );
  const deployedContract = await warp.createContract.deployFromSourceTx({
    wallet,
    initState: JSON.stringify(initialState),
    srcTxId: antRecordContractTxId,
  });

  // Buy the available record in ArNS Registry
  console.log(
    "Buying the record, %s using the ANT %s",
    nameToBuy,
    deployedContract.contractTxId
  );
  await pst.writeInteraction({
    function: "buyRecord",
    name: nameToBuy,
    tier,
    contractTxId: deployedContract.contractTxId,
    years,
  });
  console.log("Finished purchasing the record");
})();
