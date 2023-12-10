import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';

import { keyfile } from './constants';
import { initialize, warp } from './utilities';

(async () => {
  initialize();
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The subdomain to add or update
  const subDomainToUpdate = 'logo';

  // The Time To Live for this ANT to reside cached, the default and minimum is 900 seconds
  const newTtlSeconds = 3600;

  // The arweave data transaction that is to be proxied using this subdomain
  const txIdToUpdate = 'KKmRbIfrc7wiLcG0zvY1etlO0NBx1926dSCksxCIN3A';

  // This is the Arweave Name Token Contract TX ID that will have a subdomain added/modified
  const contractTxId = 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM';

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(fs.readFileSync(keyfile).toString());

  // ~~ Read contract source and initial state files ~~
  const contract = warp.pst(contractTxId);
  contract.connect(wallet);
  const writeInteraction = await contract.writeInteraction({
    function: 'setRecord',
    subDomain: subDomainToUpdate,
    ttlSeconds: newTtlSeconds,
    transactionId: txIdToUpdate,
  });

  console.log(`Deployed transaction ID: ${writeInteraction}`);
})();
