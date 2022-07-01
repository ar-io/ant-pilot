import Arweave from "arweave";
import { LoggerFactory, WarpNodeFactory } from "warp-contracts";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { keyfile } from "../constants";

let target = process.argv[2];

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The recipient target of the token transfer
  // const target = "DSgnJRaS7MLEm13grnbRbG1oUvN9MArXs2jMAn3yxW4";

  // The amount of tokens to be transferred
  const qty = 25_000_000;
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  // This is the production ArNS Registry Smartweave Contract
  const arnsRegistryContractTxId = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U";

  // Initialize Arweave
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  // Initialize `LoggerFactory`
  LoggerFactory.INST.logLevel("error");

  // Initialize SmartWeave
  const smartweave = WarpNodeFactory.memCached(arweave);

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString()
  );
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // 
	
  // Read the ANT Registry Contract
  console.log(
    "Transfering %s tokens from %s to %s",
    qty,
    walletAddress,
    target
  );
  const pst = smartweave.pst(arnsRegistryContractTxId);
  pst.connect(wallet);
  await pst.transfer({
    target,
    qty,
  });

  console.log("Finished transferring tokens");
  
  const winstonqty = "5000000000";
  // Transfer small amount of AR
  console.log(
	"Transfering %s AR from %s to %s",
	winstonqty,
	walletAddress,
	target
  );
  let transaction = await arweave.createTransaction({
    target: target,
    quantity: winstonqty
  }, wallet);
  
  await arweave.transactions.sign(transaction, wallet);

  const response = await arweave.transactions.post(transaction);
  console.log("Finished transfering AR");
})();
