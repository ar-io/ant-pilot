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
import {
  arweave,
  deployANTContract,
  getLocalWallet,
  warp,
} from './utils/helper';

describe('transfer', () => {
  let antContractOwnerAddress: string;
  let antContractTxId: string;
  let contract;

  beforeEach(async () => {
    const { wallet, address } = await getLocalWallet(arweave);
    // deploy a separate contract for this test
    const { contractTxId } = await deployANTContract({
      warp,
      owner: address,
      wallet,
    });
    antContractTxId = contractTxId;
    contract = warp.contract<ANTState>(antContractTxId).connect(wallet);
  });

  it('should transfer balance to the correct address of the ANT', async () => {
    const target = 'someothertransactionidforwalletandcontract1';
    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target,
    });

    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue } = await contract.readState();
    expect(cachedValue.state.balances[antContractOwnerAddress]).toEqual(
      undefined,
    );
    expect(cachedValue.state.balances[target]).toEqual(1);
    expect(cachedValue.state.owner).toEqual(target);
  });
});
