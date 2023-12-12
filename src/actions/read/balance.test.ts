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
import { ANTState, AntContractReadResult } from 'src/types';

import {
  INVALID_INPUT_MESSAGE,
  baselineAntState,
} from '../../../tests/utils/constants';
import { balance } from './balance';

describe('balance', () => {
  let state: ANTState = { ...baselineAntState };

  beforeEach(() => {
    state = { ...baselineAntState };
  });

  it.each(['test', '?', false, Infinity, 0, -1, parseInt(''.padEnd(43, '1'))])(
    'should throw error on invalid address type',
    async (user: any) => {
      const initState = { ...state, balances: { [user]: 1 } };
      const result = await balance(initState, {
        caller: 'test',
        input: {
          function: 'balance',
          target: user,
        },
      }).catch((e) => e);
      expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
    },
  );

  it('should return 0 for non-existent user', async () => {
    const { result } = (await balance(state, {
      caller: 'test',
      input: {
        function: 'balance',
        target: ''.padEnd(43, '1'),
      },
    })) as AntContractReadResult;
    const { balance: _balance } = result as any;
    expect(_balance).toEqual(0);
  });
});
