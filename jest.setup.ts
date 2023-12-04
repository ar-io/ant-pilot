import ArLocal from 'arlocal';

import { ANTDeployer } from './contracts/ANT-1/utils';
import { initializeArLocalTestVariables } from './tools/common/helpers';

module.exports = async function (globalConfig, projectConfig) {
  // Set reference to mongod in order to close the server during teardown.
  const arlocal = new ArLocal(1820, false);
  await arlocal.start();

  const { contractIds, arweave, wallets, warp } =
    await initializeArLocalTestVariables({
      walletCount: 10,
    });

  global.arlocal = arlocal;
  global.arweave = arweave;
  global.wallets = wallets;
  global.contractIds = contractIds;
  global.warp = warp;
};
