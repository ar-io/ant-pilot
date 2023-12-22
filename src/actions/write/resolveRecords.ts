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
import { MIN_TTL_LENGTH } from '../../constants';

export const resolveRecords = async (state) => {
  const { records } = state;

  for (const [subDomain, record] of Object.entries(records) as any) {
    if (record.contractTxId) {
      let error: string | undefined;
      const ANTState = await SmartWeave.contracts
        .readContractState(record.contractTxId)
        .catch((e) => {
          error = e.message;
        });

      const { transactionId, ttlSeconds } = ANTState.records['@'];
      state.records[subDomain] = {
        ...record,
        transactionId: transactionId ?? '',
        ttlSeconds: ttlSeconds ?? MIN_TTL_LENGTH,
        error, // to alert of resolution issues - can possibly be used for notifications
      };
    }
  }

  return { state };
};
