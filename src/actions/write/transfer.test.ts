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
  NON_CONTRACT_OWNER_MESSAGE,
} from '../../../src/constants';
import { AntContractWriteResult } from '../../../src/types';
import { baselineAntState } from '../../../tests/utils/constants';
import { transferTokens } from './transferTokens';

describe('transferTokens', () => {
  let state = { ...baselineAntState };

  beforeEach(() => {
    state = { ...baselineAntState };
  });

  it.each([
    undefined,
    false,
    1,
    0,
    Infinity,
    -1,
    '?'.padEnd(42, '1'),
    ''.padEnd(44, '1'),
  ])('should throw on invalid recipient address', async (target: any) => {
    const _state = { ...state };
    const result = await transferTokens(_state, {
      caller: 'test',
      input: {
        function: 'transfer',
        target,
      },
    }).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each(['23e', null, undefined])(
    'should throw on invalid balance type',
    async (bal: any) => {
      const _state = {
        ...state,
        owner: ''.padEnd(43, '1'),
        balances: { [''.padEnd(43, '1')]: bal },
      };
      const result = await transferTokens(_state, {
        caller: ''.padEnd(43, '1'),
        input: {
          function: 'transfer',
          target: ''.padEnd(43, '2'),
        },
      }).catch((e) => e);
      expect(result.message).toEqual(`Caller balance is not defined!`);
    },
  );

  it('should throw on insufficient balance', async () => {
    const _state = {
      ...state,
      owner: ''.padEnd(43, '1'),
      balances: { [''.padEnd(43, '1')]: 0.1 },
    };
    const result = await transferTokens(_state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'transfer',
        target: ''.padEnd(43, '2'),
      },
    }).catch((e) => e);
    expect(result.message).toEqual(`Caller does not have a token balance!`);
  });

  it('should throw on transfer to self', async () => {
    const _state = {
      ...state,
      owner: ''.padEnd(43, '1'),
      balances: { [''.padEnd(43, '1')]: 1 },
    };
    const result = await transferTokens(_state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'transfer',
        target: ''.padEnd(43, '1'),
      },
    }).catch((e) => e);
    expect(result.message).toEqual('Invalid token transfer');
  });

  it('should throw if not contract owner', async () => {
    const _state = { ...state, balances: { [''.padEnd(43, '1')]: 1 } };
    const result = await transferTokens(_state, {
      caller: ''.padEnd(43, '1'),
      input: {
        function: 'transfer',
        target: ''.padEnd(43, '2'),
      },
    }).catch((e) => e);
    expect(result.message).toEqual(NON_CONTRACT_OWNER_MESSAGE);
  });

  it('should transfer ownership', async () => {
    const result = (await transferTokens(state, {
      caller: state.owner,
      input: {
        function: 'transfer',
        target: ''.padEnd(43, '1'),
      },
    })) as AntContractWriteResult;
    expect(result.state.owner).toEqual(''.padEnd(43, '1'));
    expect(result.state.balances[''.padEnd(43, '1')]).toEqual(1);
  });
});
