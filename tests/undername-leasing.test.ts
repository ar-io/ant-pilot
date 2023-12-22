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
import { Contract, SourceType, Tag } from 'warp-contracts';

import { MIN_TTL_LENGTH } from '../src/constants';
import { ANTState } from '../src/types';
import {
  arweave,
  createLocalWallet,
  deployANTUndernameLeasingContract,
  deployARNSContract,
  warp,
} from './utils/helper';

describe('Undername Leasing', () => {
  let ownerAddress: string;
  let ownerWallet;
  let buyerAddress: string;
  let buyerWallet;
  let antContractTxId: string;
  let antContract: Contract<ANTState>;
  let arnsContractTxId: string;
  let arnsContract: Contract<any>;
  const mintAmount = 1000000000;

  beforeAll(async () => {
    const { wallet: _ownerWallet, address: _ownerAddress } =
      await createLocalWallet(arweave);
    const { wallet: _buyerWallet, address: _buyer } =
      await createLocalWallet(arweave);
    const { contractTxId } = await deployANTUndernameLeasingContract({
      warp,
      owner: _ownerAddress,
      wallet: _ownerWallet,
    });

    antContractTxId = contractTxId;
    antContract = warp
      .contract<ANTState>(antContractTxId)
      .setEvaluationOptions({
        sourceType: 'arweave' as SourceType,
        unsafeClient: 'skip',
      });

    const { contractTxId: arnsId } = await deployARNSContract({
      warp,
      owner: _ownerAddress,
      wallet: _ownerWallet,
      balances: {
        [_ownerAddress]: 0,
        [_buyer]: mintAmount * 10,
      },
    });
    arnsContractTxId = arnsId;
    arnsContract = warp.contract<any>(arnsContractTxId).setEvaluationOptions({
      sourceType: 'arweave' as SourceType,
      unsafeClient: 'skip',
    });

    ownerAddress = _ownerAddress;
    ownerWallet = _ownerWallet;

    buyerAddress = _buyer;
    buyerWallet = _buyerWallet;
  });

  it('should mint tokens with IO and buy a record on the ANT', async () => {
    const undername = 'my-super-duper-awesome-undername';
    const targetId = ''.padEnd(43, 'a');
    const { contractTxId: antToRegister } =
      await deployANTUndernameLeasingContract({
        warp,
        owner: buyerAddress,
        wallet: buyerWallet,
      });
    const antToRegisterContract = warp
      .contract<any>(antToRegister)
      .setEvaluationOptions({
        sourceType: 'arweave' as SourceType,
        unsafeClient: 'skip',
      })
      .connect(buyerWallet);

    const setReservedRecordsTxRegisterAnt =
      await antToRegisterContract.writeInteraction({
        function: 'setReservedRecords',
        pattern: '',
        subDomains: ['@', '1'],
      });

    const setRecordRegisterAnt = await antToRegisterContract.writeInteraction({
      function: 'setRecord',
      subDomain: '@',
      transactionId: targetId,
      ttlSeconds: MIN_TTL_LENGTH,
    });

    const { cachedValue: registerAntRecordValue } =
      await antToRegisterContract.readState();
    console.log(JSON.stringify(registerAntRecordValue, null, 2));

    expect(registerAntRecordValue.state.records['@']?.transactionId).toEqual(
      targetId,
    );

    expect(setReservedRecordsTxRegisterAnt?.originalTxId).toBeDefined();
    expect(setRecordRegisterAnt?.originalTxId).toBeDefined();

    const previousOwnerIOBalance = await arnsContract
      .readState()
      .then((res) => res.cachedValue.state.balances[ownerAddress]);

    const addMintingPairTx = await antContract
      .connect(ownerWallet)
      .writeInteraction({
        function: 'setMintingPair',
        tokenId: arnsContractTxId,
        conversionRate: 1,
        transferFunction: 'transfer',
        recipientArg: 'target',
        quantityArg: 'qty',
      });
    const { cachedValue: addMintingPairValue } = await antContract.readState();

    expect(addMintingPairTx?.originalTxId).toBeDefined();
    expect(
      addMintingPairValue.state.supportedTokens?.[arnsContractTxId]
        .conversionRate,
    ).toEqual(1);

    const { cachedValue: prevCachedValue } = await antContract.readState();

    const contractOwner = prevCachedValue.state.owner;
    const mintTx = await antContract.connect(buyerWallet).writeInteraction(
      {
        function: 'mint',
        type: 'TOKEN',
        tokenId: arnsContractTxId,
      },
      {
        tags: [
          { name: 'Contract', value: arnsContractTxId },
          {
            name: 'Input',
            value: JSON.stringify({
              function: 'transfer',
              target: contractOwner,
              qty: mintAmount,
            }),
          },
        ].map(({ name, value }) => new Tag(name, value)),
      },
    );

    const { cachedValue: newCachedValue } = await antContract.readState();
    console.log(JSON.stringify(newCachedValue, null, 2));
    const newOwnerIOBalance = await arnsContract
      .readState()
      .then((res) => res.cachedValue.state.balances[contractOwner]);

    expect(mintTx?.originalTxId).toBeDefined();
    expect(newCachedValue.state.balances[buyerAddress]).toEqual(mintAmount);
    expect(newOwnerIOBalance).toEqual(previousOwnerIOBalance + mintAmount);

    const setReservedRecordsTx = await antContract
      .connect(ownerWallet)
      .writeInteraction({
        function: 'setReservedRecords',
        pattern: '',
        subDomains: ['reserved'],
      });

    const { cachedValue: setReservedRecordsValue } =
      await antContract.readState();

    expect(setReservedRecordsTx?.originalTxId).toBeDefined();
    expect(setReservedRecordsValue?.state?.reserved?.subDomains).toContain(
      'reserved',
    );

    const buyRecordTx = await antContract
      .connect(buyerWallet)
      .writeInteraction({
        function: 'buyRecord',
        subDomain: undername,
        contractTxId: antToRegister,
      });

    const { cachedValue: buyRecordValue } = await antContract.readState();

    expect(buyRecordTx?.originalTxId).toBeDefined();
    expect(buyRecordValue.state.records[undername].contractTxId).toEqual(
      antToRegister,
    );
    expect(buyRecordValue.state.balances[buyerAddress]).toBeLessThan(
      newCachedValue.state.balances[buyerAddress],
    );

    const setRecordTx = await antContract
      .connect(ownerWallet)
      .writeInteraction({
        function: 'setRecord',
        subDomain: 'reserved',
        transactionId: targetId,
        ttlSeconds: MIN_TTL_LENGTH,
      });
    const { cachedValue: setRecordValue } = await antContract.readState();
    console.log(JSON.stringify(setRecordValue, null, 2));

    expect(setRecordTx?.originalTxId).toBeDefined();
    expect(setRecordValue.state.records['reserved'].transactionId).toEqual(
      targetId,
    );

    const resolveRecordTx = await antContract
      .connect(ownerWallet)
      .writeInteraction({
        function: 'resolveRecords',
      });

    const { cachedValue: resolveRecordValue } = await antContract.readState();
    console.log(JSON.stringify(resolveRecordValue, null, 2));

    expect(resolveRecordTx?.originalTxId).toBeDefined();
    expect(resolveRecordValue.state.records[undername].transactionId).toEqual(
      targetId,
    );
  });

  // it('should mint tokens with AR and buy a record on the ANT', async () => {
  //   const targetId = ''.padEnd(43, 'a');
  //   const previousOwnerArBalance =
  //     await arweave.wallets.getBalance(ownerAddress);

  //   const { cachedValue: prevCachedValue } = await antContract.readState();

  //   const contractOwner = prevCachedValue.state.owner;
  //   const mintTx = await antContract.connect(buyerWallet).writeInteraction(
  //     {
  //       function: 'mint',
  //       type: 'ARWEAVE',
  //     },
  //     {
  //       transfer: {
  //         target: contractOwner,
  //         winstonQty: mintAmount.toString(),
  //       },
  //     },
  //   );

  //   const { cachedValue: newCachedValue } = await antContract.readState();
  //   console.log(JSON.stringify(newCachedValue, null, 2));
  //   const newOwnerArBalance = await arweave.wallets.getBalance(ownerAddress);

  //   expect(mintTx?.originalTxId).toBeDefined();
  //   expect(newCachedValue.state.balances[buyerAddress]).toEqual(mintAmount);
  //   expect(+newOwnerArBalance).toEqual(+previousOwnerArBalance + mintAmount);

  //   const setReservedRecordsTx = await antContract
  //     .connect(ownerWallet)
  //     .writeInteraction({
  //       function: 'setReservedRecords',
  //       pattern: '',
  //       subDomains: ['reserved'],
  //     });

  //   const { cachedValue: setReservedRecordsValue } =
  //     await antContract.readState();

  //   expect(setReservedRecordsTx?.originalTxId).toBeDefined();
  //   expect(setReservedRecordsValue?.state?.reserved?.subDomains).toContain(
  //     'reserved',
  //   );

  //   const buyRecordTx = await antContract
  //     .connect(buyerWallet)
  //     .writeInteraction({
  //       function: 'buyRecord',
  //       subDomain: 'test',
  //       contractTxId: 'atomic',
  //     });

  //   const { cachedValue: buyRecordValue } = await antContract.readState();

  //   expect(buyRecordTx?.originalTxId).toBeDefined();
  //   expect(buyRecordValue.state.records['test'].contractTxId).toEqual(
  //     buyRecordTx?.originalTxId
  //   );
  //   expect(buyRecordValue.state.balances[buyerAddress]).toBeLessThan(
  //     newCachedValue.state.balances[buyerAddress],
  //   );

  //   const setRecordTx = await antContract
  //     .connect(ownerWallet)
  //     .writeInteraction({
  //       function: 'setRecord',
  //       subDomain: 'reserved',
  //       transactionId: targetId,
  //       ttlSeconds: MIN_TTL_LENGTH,
  //     });
  //   const { cachedValue: setRecordValue } = await antContract.readState();
  //   console.log(JSON.stringify(setRecordValue, null, 2));

  //   expect(setRecordTx?.originalTxId).toBeDefined();
  //   expect(setRecordValue.state.records['reserved'].transactionId).toEqual(
  //     targetId,
  //   );
  // });
});
