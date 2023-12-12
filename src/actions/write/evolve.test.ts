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
import { baselineAntState } from '../../../tests/utils/constants';
import {
  INVALID_INPUT_MESSAGE,
  NON_CONTRACT_OWNER_MESSAGE,
} from '../../constants';
import { AntContractWriteResult } from '../../types';
import { evolve } from './evolve';

describe('evolve', () => {
  it.each([
    {
      value: 'test',
    },
    {
      value: 1,
    },
    {
      value: true,
    },
    {
      value: undefined,
    },
    {
      random: 'test',
    },
  ])('should throw an error on bad input', async (badInput: { value: any }) => {
    const error: any = await evolve(baselineAntState, {
      caller: 'test',
      input: {
        function: 'evolve',
        ...badInput,
      },
    }).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each([
    'hacker',
    undefined,
    null,
    false,
    true,
    Infinity,
    1,
    0,
    -1,
    [],
    {},
    ''.padEnd(44, '1'),
    '?'.padEnd(42, '1'),
  ])('should throw an error on bad caller', async (badCaller: string) => {
    const error: any = await evolve(baselineAntState, {
      caller: badCaller,
      input: {
        function: 'evolve',
        value: '1111111111111111111111111111111111111111111',
      },
    }).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(NON_CONTRACT_OWNER_MESSAGE);
  });

  it.each([
    {
      value: '1111111111111111111111111111111111111111111',
    },
  ])(
    'should evolve the contract with valid input',
    async (goodInput: { value: string }) => {
      const result = (await evolve(baselineAntState, {
        caller: 'test',
        input: {
          function: 'evolve',
          ...goodInput,
        },
      })) as AntContractWriteResult;

      expect(result.state).toEqual({
        ...baselineAntState,
        evolve: goodInput.value,
      });
    },
  );
});
