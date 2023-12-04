import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import { LoggerFactory, WarpFactory } from 'warp-contracts';

import { testKeyfile } from './constants';

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The recipient target of the token transfer
  const target = '31LPFYoow2G7j-eSSsrIh8OlNaARZ84-80J-8ba68d8';

  // This is the Arweave Name Token Contract TX ID that will be transferred
  const antRecordContractTxId = 'lXQnhpzNXN0vthWm3sZwE2z7E_d3EWALe5lZPruCOD4';
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: 'testnet.redstone.tools',
    timeout: 600000,
    port: 443,
    protocol: 'https',
  });

  // Initialize `LoggerFactory`
  LoggerFactory.INST.logLevel('error');

  // Initialize Warp
  const warp = WarpFactory.forTestnet();

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(testKeyfile).toString(),
  );
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Read the ANT Registry Contract
  console.log(
    'Transfering %s ANT from %s to %s',
    antRecordContractTxId,
    walletAddress,
    target,
  );
  const pst = warp.pst(antRecordContractTxId);
  pst.connect(wallet);
  await pst.transfer({
    target,
    qty: 1,
  });

  console.log('Finished transferring tokens');
})();
