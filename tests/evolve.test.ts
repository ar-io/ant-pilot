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
import Arweave from 'arweave';
import fs from 'fs';
import path from 'path';
import { JWKInterface, Warp } from 'warp-contracts';

import { ANTState } from '../src/types';
import { ANTDeployer } from '../tools/common/helpers';

describe('Testing evolve...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const warp: Warp = global.warp;
  const defaultOwner = Object.entries(wallets)[0];

  let _srcTxId: string;

  beforeEach(async () => {
    const contractSource = fs.readFileSync(
      path.join(__dirname, '../dist/contract.js'),
      'utf8',
    );
    const srcTx = await warp.createSource(
      { src: contractSource },
      Object.values(wallets)[0],
      true,
    );
    _srcTxId = await warp.saveSource(srcTx, true);
    
  });

  it('Should evolve the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const evolveResult = await contract.evolve(_srcTxId);
    
    const { cachedValue } = await contract.readState();

    expect(evolveResult?.originalTxId).toBeDefined();
    expect(cachedValue.state.evolve).toEqual(_srcTxId);
  });
});
