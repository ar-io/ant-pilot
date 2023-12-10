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

import { initializeArLocalTestVariables } from '../tools/common/helpers';

module.exports = async function () {
  // Set reference to mongod in order to close the server during teardown.
  const arlocal = new ArLocal(1820, false);
  await arlocal.start();

  const { contractIds, arweave, wallets, warp } =
    await initializeArLocalTestVariables({
      walletCount: 10,
    });

  global.arlocal = arlocal;
  global.arweave = arweave;
  global.wallets = wallets;
  global.contractIds = contractIds;
  global.warp = warp;
};
