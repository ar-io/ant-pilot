import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import { LoggerFactory, WarpFactory } from 'warp-contracts';

import { testKeyfile } from './constants';

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const subDomainToUpdate = '@';
  const txIdToUpdate = 'q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs';
  const newTtl = 900; // This is the name that will be purchased in the Arweave Name System Registry
  const contractTxId = 'lheofeBVyaJ8s9n7GxIyJNNc62jEVCKD7lbL3fV8kzU';
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: 'testnet.redstone.tools',
    timeout: 600000,
    port: 443,
    protocol: 'https',
  });

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel('error');

  // ~~ Initialize Warp ~~
  const warp = WarpFactory.forTestnet();

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(testKeyfile).toString(),
  );

  // ~~ Read contract source and initial state files ~~
  const pst = warp.pst(contractTxId);
  pst.connect(wallet);
  await pst.writeInteraction({
    function: 'setRecord',
    subDomain: subDomainToUpdate,
    ttl: newTtl,
    transactionId: txIdToUpdate,
  });
})();
