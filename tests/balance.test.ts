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
import { JWKInterface, Warp } from 'warp-contracts';

import { ANTState } from '../src/types';
import { ANTDeployer } from '../tools/common/helpers';

describe('Testing read balance...', () => {
  const warp: Warp = global.warp;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];

  it('Should retrieve balance of the owner', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT);
    const { cachedValue } = await contract.readState();
    const { result } = (await contract.viewState({
      function: 'balance',
      target: defaultOwner[0],
    })) as {
      result: { balance: number; target: string; ticker: string };
    };

    expect(result).toBeDefined();
    expect(result.balance).toEqual(1);
    expect(result.target).toEqual(defaultOwner[0]);
    expect(result.ticker).toEqual(cachedValue.state.ticker);
  });
});
