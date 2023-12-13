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
import ArLocal from 'arlocal';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import path from 'path';
import { LoggerFactory, SourceType, Tag, Warp, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { ANTState } from '../../src/types';
import { INITIAL_STATE, WALLET_FUND_AMOUNT } from './constants';

LoggerFactory.INST.logLevel('none');

export const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http',
});
export const warp = WarpFactory.forLocal(1984, arweave).use(new DeployPlugin());
export const arlocal = new ArLocal(1984, false);
// ~~ Write function responsible for adding funds to the generated wallet ~~
export async function addFunds(
  arweave: Arweave,
  wallet: JWKInterface,
  amount: number = WALLET_FUND_AMOUNT,
): Promise<boolean> {
  const walletAddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletAddress}/${amount}`);
  return true;
}

// ~~ Write function responsible for mining block on the Arweave testnet ~~
export async function mineBlock(arweave: Arweave): Promise<boolean> {
  await arweave.api.get('mine');
  return true;
}

export async function getCurrentBlock(arweave: Arweave): Promise<number> {
  return (await arweave.blocks.getCurrent()).height;
}

export async function mineBlocks(
  arweave: Arweave,
  blocks: number,
): Promise<void> {
  for (let i = 0; i < blocks; i++) {
    await mineBlock(arweave);
  }
}

export async function createLocalWallet(
  arweave: Arweave,
): Promise<{ wallet: JWKInterface; address: string }> {
  // ~~ Generate wallet and add funds ~~
  const wallet = await arweave.wallets.generate();
  const address = await arweave.wallets.jwkToAddress(wallet);
  await addFunds(arweave, wallet);
  return {
    wallet,
    address,
  };
}

export async function setupInitialContractState(
  owner: string,
): Promise<ANTState> {
  const state: ANTState = INITIAL_STATE as unknown as ANTState;

  // add balance to the owner
  state.balances = {
    ...state.balances,
    [owner]: 1,
  };

  // set the owner to the first wallet
  state.owner = owner;

  return state;
}

export async function getLocalWallet(
  arweave,
  index = 0,
): Promise<{
  address: string;
  wallet: JWKInterface;
}> {
  const wallet = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../wallets/${index}.json`), 'utf8'),
  ) as unknown as JWKInterface;
  const address = await arweave.wallets.getAddress(wallet);
  return {
    address,
    wallet,
  };
}

export function getLocalANTContractId(): string {
  const contract = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8'),
  ) as unknown as ANTState & { id: string };
  return contract.id;
}

export async function deployANTContract({
  warp,
  owner,
  wallet,
}: {
  owner: string;
  warp: Warp;
  wallet: JWKInterface;
}): Promise<{
  contractTxId: string;
  srcTxId: string;
}> {
  const sourceCode = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, '../../initial-state.json'),
    'utf8',
  );
  const ownerState = {
    ...JSON.parse(initState),
    owner,
    records: {
      remove: {
        transactionId: '',
        ttlSeconds: 900,
      },
    },
    controllers: ['someothertransactionidforwalletandcontract1'],
    balances: {
      [owner]: 1,
    },
  };
  const { contractTxId, srcTxId } = await warp.deploy(
    {
      src: sourceCode,
      initState: JSON.stringify(ownerState),
      wallet,
    },
    true,
  );
  return {
    contractTxId,
    srcTxId: srcTxId as string,
  };
}


export async function deployANTUCMContract({
  warp,
  owner,
  wallet,
}: {
  owner: string;
  warp: Warp;
  wallet: JWKInterface;
}): Promise<{
  contractTxId: string;
  srcTxId: string;
}> {
  const sourceCode = fs.readFileSync(
    path.join(__dirname, '../../dist/contract-ucm.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, '../../initial-state-ucm.json'),
    'utf8',
  );
  const ownerState = {
    ...JSON.parse(initState),
    owner,
    records: {
      remove: {
        transactionId: '',
        ttlSeconds: 900,
      },
    },
    controllers: [owner],
    balances: {
      [owner]: 1,
    },
  };
  const { contractTxId, srcTxId } = await warp.deploy(
    {
      src: sourceCode,
      initState: JSON.stringify(ownerState),
      wallet,
      tags: buildANTUCMTags()
    },
    true, 
  );
  return {
    contractTxId,
    srcTxId: srcTxId as string,
  };
}

export async function deployUCMContract({
  warp,
  owner,
  wallet,
}: {
  owner: string;
  warp: Warp;
  wallet: JWKInterface;
}): Promise<{
  contractTxId: string;
  srcTxId: string;
}> {
  const sourceCode = fs.readFileSync(
    path.join(__dirname, './ucm/source.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, './ucm/state.json'),
    'utf8',
  );
  const localHeight = global.arweave.blocks.getCurrent();
  const ownerState = {
    ...JSON.parse(initState),
    creator: owner,
    originHeight: localHeight,

  };
  const { contractTxId, srcTxId } = await warp.deploy(
    {
      src: sourceCode,
      initState: JSON.stringify(ownerState),
      wallet,
      evaluationManifest: {
        evaluationOptions: {
          sourceType: 'arweave' as SourceType,
          unsafeClient: 'skip',
          allowBigInt: true,

        }
      }
    },
    true,
  );
  return {
    contractTxId,
    srcTxId: srcTxId as string,
  };
}


export async function deployUContract({
  warp,
  owner,
  wallet,
}: {
  owner: string;
  warp: Warp;
  wallet: JWKInterface;
}): Promise<{
  contractTxId: string;
  srcTxId: string;
}> {
  const sourceCode = fs.readFileSync(
    path.join(__dirname, './u/source.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, './u/state.json'),
    'utf8',
  );
  const ownerState = {
    ...JSON.parse(initState),
    owner: owner,
    balances: {
      owner: 1000000000
    }

  };
  const { contractTxId, srcTxId } = await warp.deploy(
    {
      src: sourceCode,
      initState: JSON.stringify(ownerState),
      wallet,
      evaluationManifest: {
        evaluationOptions: {
          sourceType: 'both' as SourceType,
          internalWrites: true,
          unsafeClient: 'skip',
          allowBigInt: true,

        }
      }
    },
    true,
  );
  return {
    contractTxId,
    srcTxId: srcTxId as string,
  };
}

export function buildANTUCMTags(
  title = 'ANT UCM Contract',
  description = 'ANT UCM Contract. This contract allows for registration of names on the Arweave Name System (ArNS). See more at https://ar.io/arns',
  contentType = 'application/json'
): Tag[] {
  return [
    { name: 'Content-Type', value: contentType },
    { name: 'Title', value: title },
    { name: 'Description', value: description},
    { name: 'Topic:ANT', value: 'ANT' },
    { name: 'Topic:ArNS', value: 'ArNS' },
    { name: 'Type', value: 'token' }
  ].map((t)=> new Tag(t.name, t.value));
}

