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
import fs from 'fs';
import path from 'path';
import { JWKInterface, Warp } from 'warp-contracts';

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
    path.join(__dirname, '../dist/contract.js'),
    'utf8',
  );
  const initState = fs.readFileSync(
    path.join(__dirname, '../state.json'),
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
