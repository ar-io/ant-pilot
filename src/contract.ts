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
import { balance } from './actions/read/balance';
import { evolve } from './actions/write/evolve';
import { removeController } from './actions/write/removeController';
import { removeRecord } from './actions/write/removeRecord';
import { setController } from './actions/write/setController';
import { setName } from './actions/write/setName';
import { setRecord } from './actions/write/setRecord';
import { setTicker } from './actions/write/setTicker';
import { transferTokens } from './actions/write/transferTokens';
import { ANTState, ContractResult, AntAction } from './types';

declare const ContractError;

export async function handle(
  state: ANTState,
  action: AntAction,
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'transfer':
      return await transferTokens(state, action);
    case 'setRecord':
      return await setRecord(state, action);
    case 'setName':
      return await setName(state, action);
    case 'setTicker':
      return await setTicker(state, action);
    case 'setController':
      return await setController(state, action);
    case 'removeController':
      return await removeController(state, action);
    case 'removeRecord':
      return await removeRecord(state, action);
    case 'balance':
      return await balance(state, action);
    case 'evolve':
      return await evolve(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`,
      );
  }
}
