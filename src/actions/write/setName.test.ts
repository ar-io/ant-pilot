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
import { setName } from './setName';

describe('setName', () => {
  let state = { ...baselineAntState };

  beforeEach(() => {
    state = { ...baselineAntState };
  });

  it('should throw if not owner or controller', async () => {
    const result = await setName(state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'setName',
        name: 'muahahahaha i am a hacker and i am going to change your name without your permission',
      },
    }).catch((e) => e);
    expect(result.message).toEqual(NON_CONTRACT_OWNER_CONTROLLER_MESSAGE);
  });

  it.each([undefined, Infinity, 1, 0, -1, 1.1, true, false, null, {}, []])(
    'should throw on bad name',
    async (name: any) => {
      const result = await setName(state, {
        caller: 'test',
        input: {
          function: 'setName',
          name,
        },
      }).catch((e) => e);
      expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
    },
  );

  it('should set name as owner', async () => {
    const result = (await setName(state, {
      caller: 'test',
      input: {
        function: 'setName',
        name: 'test',
      },
    })) as AntContractWriteResult;
    expect(result.state.name).toEqual('test');
  });

  it('should set name as controller', async () => {
    const _state = { ...state, controllers: [''.padEnd(43, '1')] };
    const result = (await setName(_state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'setName',
        name: 'test',
      },
    })) as AntContractWriteResult;
    expect(result.state.name).toEqual('test');
  });
});
