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
import { ANTState } from '../src/types';
import { warp, arweave, getLocalWallet } from './utils/helper';

describe('removeController', () => {
  let antContractTxId: string;
  let antContractOwnerAddress: string;
  let contract;

  beforeEach(async () => {
    const { wallet , address } = await getLocalWallet(arweave);
    antContractOwnerAddress = address;
    antContractTxId = process.env.ANT_CONTRACT_TX_ID;
    contract = warp.contract<ANTState>(antContractTxId).connect(wallet)
  });

  it('should remove controller from the ANT', async () => {
    const writeInteraction = await contract.writeInteraction({
      function: 'removeController',
      target: antContractOwnerAddress,
    });

    expect(writeInteraction?.originalTxId).toBeDefined();
    const { cachedValue } = await contract.readState();
    expect(cachedValue.state.controllers[antContractOwnerAddress]).toEqual(undefined)
  });
});
