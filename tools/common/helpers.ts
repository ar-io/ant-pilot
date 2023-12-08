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
import { JWKInterface } from 'arbundles/src/interface-jwk';
import Arweave from 'arweave';
import * as fs from 'fs';
import path from 'path';
import { LoggerFactory, PstState, Warp, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { INITIAL_STATE, WALLET_FUND_AMOUNT } from './constants';
import { ContractDeployer } from './types';

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

export async function setupInitialANTContractState<T extends PstState>(
  owner: string,
): Promise<T> {
  const state = INITIAL_STATE as unknown as T;

  // add balance to the owner
  state.balances = {
    ...state.balances,
    [owner]: 1,
  };

  // set the owner to the first wallet
  state.owner = owner;

  return state;
}

export async function setupInitialArNSContractState<T extends PstState>(
  holders: string[],
): Promise<T> {
  const state = INITIAL_STATE as unknown as T;

  // add balance to the owner
  state.balances = {
    ...state.balances,
    ...holders.reduce(
      (acc, holder) => {
        acc[holder] = 1_000_000;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  // set the owner to the first wallet
  state.owner = holders[0];

  return state;
}

export function getLocalWallet(index = 0): JWKInterface {
  const wallet = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../wallets/${index}.json`), 'utf8'),
  ) as unknown as JWKInterface;
  return wallet;
}

export function getLocalANTContractId<T extends Record<string, any>>(): string {
  const contract = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8'),
  ) as unknown as T & { id: string };
  return contract.id;
}

export async function initializeArLocalTestVariables({
  walletCount,
  contractInitializations,
}: {
  walletCount: number;
  contractInitializations?: Record<string, ContractDeployer>; //
}): Promise<{
  wallets: Record<string, JWKInterface>;
  arweave: Arweave;
  contractIds: Record<string, Record<string, string[]>[]>;
  warp;
}> {
  const arweave = Arweave.init({
    host: 'localhost',
    port: 1820,
    protocol: 'http',
  });

  const warp = WarpFactory.forLocal(1820, arweave).use(new DeployPlugin());

  LoggerFactory.INST.logLevel('error');

  const wallets: Record<string, JWKInterface> = {};

  for (let i = 0; i < walletCount; i++) {
    const { wallet, address } = await createLocalWallet(arweave);
    wallets[address] = wallet;
    if (i) {
      continue;
    }
    await addFunds(arweave, wallet, 1_000_000);
  }
  const contractIds: Record<string, Record<string, string[]>[]> = (
    await Promise.all(
      Object.entries(contractInitializations ?? {}).map(
        async ([name, deployer]) => {
          const contractIds = await deployer(warp, wallets);
          return {
            name,
            ids: contractIds,
          };
        },
      ),
    )
  ).reduce(
    (
      acc,
      contractDeployResults: { name: string; ids: { [x: string]: string[] }[] },
    ) => {
      acc[contractDeployResults.name] = contractDeployResults.ids;
      return acc;
    },
    {} as Record<string, Record<string, string[]>[]>,
  );

  return {
    wallets,
    arweave,
    contractIds,
    warp,
  };
}

// deploys a single ANT contract
export async function ANTDeployer(
  warp: Warp,
  deployer: {
    address: string;
    wallet: JWKInterface;
  },
): Promise<string> {
  const { address, wallet } = deployer;
  const sourceCode = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, '../../initial-state.json'),
    'utf8',
  );
  let contractId = '';
  try {
    const ownerState = {
      ...JSON.parse(initState),
      owner: address,
      controllers: [address],
      balances: {
        ...JSON.parse(initState).balances,
        [address]: 1,
      },
    };
    const { contractTxId } = await warp.deploy(
      {
        src: sourceCode,
        initState: JSON.stringify(ownerState),
        wallet,
      },
      true,
    );
    contractId = contractTxId;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return contractId;
}
