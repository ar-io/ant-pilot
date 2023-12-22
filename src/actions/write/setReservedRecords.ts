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
import { INVALID_INPUT_MESSAGE } from '../../constants';
import { validateSetReservedRecords } from '../../validations-undername-leasing';

export const setReservedRecords = async (state, { input, caller }) => {
  const { pattern, subDomains } = input;

  if (!validateSetReservedRecords(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== state.owner) {
    throw new ContractError(
      'Caller must be contract owner to set reserved records',
    );
  }

  const reservedRecords = new Set([
    ...subDomains,
    ...state.reserved.subDomains,
  ]);
  const regexString =
    reservedRecords.size > 0
      ? `(${[...reservedRecords].join('|')}|[${
          pattern ?? state.reserved.pattern
        }])`
      : '';

  state.reserved = {
    pattern: regexString,
    subDomains: [...reservedRecords],
  };

  return { state };
};
