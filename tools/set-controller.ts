import Arweave from 'arweave';
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
  // This is the Arweave Name Token Contract TX ID that will have a controller set
  const contractTxId = 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM';

  // The arweave wallet that is given Controller permission over this ANT, allowing them to update its records, but not transfer it.
  const target = '6Z-ifqgVi1jOwMvSNwKWs6ewUEQ0gU9eo4aHYC3rN1M';
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(fs.readFileSync(keyfile).toString());

  // ~~ Read contract source and initial state files ~~
  const contract = warp.pst(contractTxId);
  contract.connect(wallet);
  const writeInteraction = await contract.writeInteraction({
    function: 'setController',
    target,
  });

  console.log(
    `Deployed transaction ID: ${writeInteraction}`,
  );
})();
