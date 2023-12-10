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

describe('Testing transfer...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];

  const warp: Warp = global.warp;

  it('Should transfer balance to the correct address of the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: defaultOwner2[0],
    });

    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.balances[defaultOwner[0]]).toEqual(undefined);
    expect(newState.balances[defaultOwner2[0]]).toEqual(1);
    expect(newState.owner).toEqual(defaultOwner2[0]);
  });

  it('should not transfer with incorrect ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;

    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: defaultOwner[0],
    });

    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    expect(newState.owner).toEqual(prevState.owner);
  });

  it('should not transfer with only controller ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: 'setController',
      target: defaultOwner2[0],
    });

    contract.connect(defaultOwner2[1]); // this wallet is only a controller
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: defaultOwner[0],
      qty: 1,
    });

    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.owner).toEqual(prevState.owner);
  });
});
