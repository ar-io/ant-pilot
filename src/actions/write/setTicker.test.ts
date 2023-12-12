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
import {
  INVALID_INPUT_MESSAGE,
  NON_CONTRACT_OWNER_CONTROLLER_MESSAGE,
} from '../../../src/constants';
import { AntContractWriteResult } from '../../../src/types';
import { baselineAntState } from '../../../tests/utils/constants';
import { setTicker } from './setTicker';

describe('setTicker', () => {
  let state = { ...baselineAntState };

  beforeEach(() => {
    state = { ...baselineAntState };
  });

  it('should throw if not owner or controller', async () => {
    const result = await setTicker(state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'setTicker',
        ticker:
          'muahahahaha i am a hacker and i am going to change your ticker without your permission',
      },
    }).catch((e) => e);
    expect(result.message).toEqual(NON_CONTRACT_OWNER_CONTROLLER_MESSAGE);
  });

  it.each([undefined, Infinity, 1, 0, -1, 1.1, true, false, null, {}, []])(
    'should throw on bad ticker',
    async (ticker: any) => {
      const result = await setTicker(state, {
        caller: 'test',
        input: {
          function: 'setTicker',
          ticker,
        },
      }).catch((e) => e);
      expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
    },
  );

  it('should set ticker as owner', async () => {
    const result = (await setTicker(state, {
      caller: 'test',
      input: {
        function: 'setTicker',
        ticker: 'test',
      },
    })) as AntContractWriteResult;
    expect(result.state.ticker).toEqual('test');
  });

  it('should set ticker as controller', async () => {
    const _state = { ...state, controllers: [''.padEnd(43, '1')] };
    const result = (await setTicker(_state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'setTicker',
        ticker: 'test',
      },
    })) as AntContractWriteResult;
    expect(result.state.ticker).toEqual('test');
  });
});
