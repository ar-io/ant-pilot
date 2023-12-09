import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import {
  LoggerFactory,
  WarpFactory,
  defaultCacheOptions,
} from 'warp-contracts';

import { keyfile } from './constants';
import { initialize, warp } from './utilities';

(async () => {
  initialize();
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const subDomainToRemove = 'changeme';
  const contractTxId = 'lheofeBVyaJ8s9n7GxIyJNNc62jEVCKD7lbL3fV8kzU'; // The ANT Smartweave Contract that is to be modified
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString(),
  );

  // ~~ Read contract source and initial state files ~~
  const contract = warp.contract(contractTxId);
  contract.connect(wallet);
  const writeInteraction = await contract.writeInteraction({
    function: 'removeRecord',
    subDomain: subDomainToRemove,
  });

  console.log('Deployed transaction ID: ', writeInteraction);
})();
