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
import { ANTState, AntAction, ContractResult } from '../../types';
// composed by ajv at build
import { validateBalance } from '../../validations';

declare const ContractError;

export const balance = async (
  state: ANTState,
  { input }: AntAction,
): Promise<ContractResult> => {
  const ticker = state.ticker;
  const owner = state.owner;
  const { target } = input;

  if (!validateBalance(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (typeof target !== 'string') {
    throw new ContractError('Must specify target to get balance for');
  }

  return {
    result: { target, ticker, balance: target === owner ? 1 : 0 },
  };
};
