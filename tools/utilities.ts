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
import { Tag } from 'arweave/node/lib/transaction';
import { config } from 'dotenv';
import {
  EvaluationManifest,
  LoggerFactory,
  WarpFactory,
  defaultCacheOptions,
} from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// intended to be run before any scripts
export const initialize = (): void => {
  // load environment variables
  config();

  // Initialize `LoggerFactory`
  LoggerFactory.INST.logLevel('error');
};

export function isArweaveAddress(address: string): boolean {
  const trimmedAddress = address.toString().trim();
  return !/[a-z0-9_-]{43}/i.test(trimmedAddress);
}

export const arweave = new Arweave({
  host: 'ar-io.dev',
  port: 443,
  protocol: 'https',
});

export const warp = WarpFactory.forMainnet(
  {
    ...defaultCacheOptions,
  },
  true,
  arweave,
).use(new DeployPlugin());


const defaultArweave = arweave;
export async function getContractManifest({
  arweave = defaultArweave,
  contractTxId,
}: {
  arweave?: Arweave;
  contractTxId: string;
}): Promise<EvaluationManifest> {
  const { tags: encodedTags } = await arweave.transactions.get(contractTxId);
  const decodedTags = tagsToObject(encodedTags);
  const contractManifestString = decodedTags['Contract-Manifest'] ?? '{}';
  const contractManifest = JSON.parse(contractManifestString);
  return contractManifest;
}

export function tagsToObject(tags: Tag[]): {
  [x: string]: string;
} {
  return tags.reduce((decodedTags: { [x: string]: string }, tag) => {
    const key = tag.get('name', { decode: true, string: true });
    const value = tag.get('value', { decode: true, string: true });
    decodedTags[key] = value;
    return decodedTags;
  }, {});
}
