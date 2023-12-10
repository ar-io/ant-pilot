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
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as fs from 'fs';

import { keyfile } from './constants';
import { initialize, warp } from './utilities';

(async () => {
  initialize();
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The recipient target of the token transfer
  const target = '31LPFYoow2G7j-eSSsrIh8OlNaARZ84-80J-8ba68d8';

  // This is the Arweave Name Token Contract TX ID that will be transferred
  const antRecordContractTxId = 'lXQnhpzNXN0vthWm3sZwE2z7E_d3EWALe5lZPruCOD4';

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(keyfile).toString(),
  );
  const contract = warp.pst(antRecordContractTxId);
  contract.connect(wallet);
  const transferTxId = await contract.transfer({
    target,
    qty: 1,
  });

  console.log(`Deployed transaction ID: ${transferTxId}`);
})();
