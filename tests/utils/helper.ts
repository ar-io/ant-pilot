import ArLocal from 'arlocal';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';
import path from 'path';
import { LoggerFactory, Warp, WarpFactory } from 'warp-contracts';
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
  for (let i = 0; i < blocks; i++) {}
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
    srcTxId,
  };
}
