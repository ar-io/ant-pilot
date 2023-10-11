import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import path from 'path';
import { LoggerFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { keyfile } from './constants';
import { initialize, warp } from './utilities';

/* eslint-disable no-console */
(async () => {
  // simple setup script
  initialize();

  // override log settings
  LoggerFactory.INST.logLevel('none');

  // load local wallet
  const wallet: JWKInterface = JSON.parse(
    process.env.JWK ? process.env.JWK : fs.readFileSync(keyfile).toString(),
  );

  // load state of contract
  const antContractTxId =
    process.env.ANT_CONTRACT_TX_ID ??
    'YOUR ANT CONTRACT';

  // ~~ Initialize SmartWeave ~~
  const warpWithDeploy = warp.use(new DeployPlugin());

  // Read the ArNS Registry Contract
  const contract = warpWithDeploy.pst(antContractTxId);
  contract.connect(wallet);

  // ~~ Read contract source and initial state files ~~
  const newLocalSourceCodeJS = fs.readFileSync(
    path.join(__dirname, '../dist/contract.js'),
    'utf8',
  );

  // Create the evolved source code tx
  const evolveSrcTx = await warpWithDeploy.createSource(
    { src: newLocalSourceCodeJS },
    wallet,
    true,
  );
  const evolveSrcTxId = await warpWithDeploy.saveSource(evolveSrcTx, true);
  if (evolveSrcTxId === null) {
    return 0;
  }

  // eslint-disable-next-line
  const evolveInteractionTXId = await contract.writeInteraction(
    { function: 'evolve', value: evolveSrcTxId },
    {
      disableBundling: true,
    },
  );

  console.log ("Evolve Interaction Tx Id: ", evolveInteractionTXId?.originalTxId)
  // DO NOT CHANGE THIS - it's used by github actions
  console.log(evolveSrcTxId);
})();
