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
import { Contract, SourceType } from 'warp-contracts';

import { ANTState } from '../src/types';
import {
  arweave,
  createLocalWallet,
  deployANTUCMContract,
  deployUCMContract,
  deployUContract,
  warp,
} from './utils/helper';

describe('ucm', () => {
  let owner: string;
  let ownerWallet;
  let buyer: string;
  let buyerWallet;
  let antContractTxId: string;
  let antContract: Contract<ANTState>;
  let ucmContractTxId: string;
  let ucmContract: Contract;
  let uContractTxId: string;
  let uContract: Contract;

  beforeAll(async () => {
    const { wallet: _ownerWallet, address: _owner } =
      await createLocalWallet(arweave);
    const { wallet: _buyerWallet, address: _buyer } =
      await createLocalWallet(arweave);
    const { contractTxId } = await deployANTUCMContract({
      warp,
      owner: _owner,
      wallet: _ownerWallet,
    });

    const { contractTxId: uContractId } = await deployUContract({
      warp,
      owner,
      wallet: _ownerWallet,
      balances: {
        [_owner]: 1000000000,
        [_buyer]: 1000000000,
      },
    });

    const { contractTxId: ucmContractId } = await deployUCMContract({
      warp,
      owner,
      wallet: _ownerWallet,
      uContractId,
    });

    antContractTxId = contractTxId;
    antContract = warp
      .contract<ANTState>(antContractTxId)
      .setEvaluationOptions({
        sourceType: 'arweave' as SourceType,
        unsafeClient: 'skip',
        allowBigInt: true,
        internalWrites: true,
        useConstructor: true,
      });

    ucmContractTxId = ucmContractId;
    ucmContract = warp.contract(ucmContractTxId).setEvaluationOptions({
      sourceType: 'arweave' as SourceType,
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true,
    });

    uContractTxId = uContractId;
    uContract = warp.contract(uContractTxId).setEvaluationOptions({
      sourceType: 'both' as SourceType,
      internalWrites: true,
      unsafeClient: 'skip',
      allowBigInt: true,
    });

    owner = _owner;
    ownerWallet = _ownerWallet;

    buyer = _buyer;
    buyerWallet = _buyerWallet;
  });

  it('should trade ant on the UCM', async () => {
    const addPairRes = await ucmContract.connect(ownerWallet).writeInteraction({
      function: 'addPair',
      pair: [antContractTxId, uContractTxId],
    });
    expect(addPairRes?.originalTxId).toBeDefined();

    const allowRes = await antContract.connect(ownerWallet).writeInteraction({
      function: 'allow',
      target: ucmContractTxId,
      qty: 1,
    });
    expect(allowRes?.originalTxId).toBeDefined();

    const sellOrderRes = await ucmContract
      .connect(ownerWallet)
      .writeInteraction({
        function: 'createOrder',
        pair: [antContractTxId, uContractTxId],
        transaction: allowRes?.originalTxId,
        qty: 1,
        price: 1,
      });
    expect(sellOrderRes?.originalTxId).toBeDefined();

    const allowUSpendingRes = await uContract
      .connect(buyerWallet)
      .writeInteraction({
        function: 'allow',
        target: ucmContractTxId,
        qty: 1,
      });
    expect(allowUSpendingRes?.originalTxId).toBeDefined();

    const buyOrderRes = await ucmContract
      .connect(buyerWallet)
      .writeInteraction({
        function: 'createOrder',
        pair: [uContractTxId, antContractTxId],
        transaction: allowUSpendingRes?.originalTxId,
        qty: 1,
      });
    expect(buyOrderRes?.originalTxId).toBeDefined();

    const claimRes = await antContract.connect(buyerWallet).writeInteraction({
      function: 'claim',
      txID: buyOrderRes?.originalTxId,
      qty: 1,
    });
    expect(claimRes?.originalTxId).toBeDefined();

    const antState = await antContract.readState();

    expect(antState.cachedValue.state.balances[buyer]).toEqual(1);
    expect(antState.cachedValue.state.balances[owner]).not.toBeDefined();
  });
});
