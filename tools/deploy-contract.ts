/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as fs from 'fs';
import path from 'path';
import {
  ContractDeploy,
  PstState,
} from 'warp-contracts';

import { keyfile } from './constants';
import { arweave, initialize, warp } from './utilities';
import { JWKInterface } from 'arweave/node/lib/wallet';

(async () => {
  initialize()

  // Get the key file used for the distribution
  // load local wallet
  const keyPath = path.join(__dirname, keyfile);
  const wallet: JWKInterface = JSON.parse(
    process.env.JWK ? process.env.JWK : fs.readFileSync(keyPath).toString(),
  );
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // ~~ Read contract source and initial state files ~~
  const contractSrc = fs.readFileSync(
    path.join(__dirname, '../dist/contract.js'),
    'utf8',
  );
  const stateFromFile: PstState = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../initial-state.json'), 'utf8'),
  );
  const initialState: PstState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
      controller: walletAddress,
    },
    balances: {
      [walletAddress]: 1,
    },
  };

  // ~~ Deploy contract ~~
  const contractDeploy: ContractDeploy = await warp.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  // DO NOT CHANGE THIS - it's used by github actions
  console.log(contractDeploy.srcTxId);
})();
