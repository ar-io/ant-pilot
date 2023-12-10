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
import { JWKInterface, Warp } from 'warp-contracts';

import { ANTState } from '../src/types';
import { ANTDeployer } from '../tools/common/helpers';

describe('Testing setName...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];
  const warp: Warp = global.warp;

  it('Should set the name of the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const name = 'my-new-name';

    const result = await contract.writeInteraction({
      function: 'setName',
      name,
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.name).toEqual(name);
  });

  it('should not set name with incorrect ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: 'setName',
      name: 'HACKED',
    });

    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual(prevState.name);
  });

  it('should set name as controller', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: 'setController',
      target: defaultOwner2[0],
    });

    contract.connect(defaultOwner2[1]);
    await contract.writeInteraction({
      function: 'setName',
      name: 'My New Token Renamed',
    });

    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual('My New Token Renamed');
  });
});
