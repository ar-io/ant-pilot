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
import { setController } from './setController';

describe('setController', () => {
  it.each([
    undefined,
    false,
    1,
    0,
    Infinity,
    -1,
    '?'.padEnd(42, '1'),
    ''.padEnd(44, '2'),
  ])('should throw on bad target', async (target: any) => {
    const initState = { ...baselineAntState, controllers: [] };
    const result = await setController(initState, {
      caller: 'test',
      input: {
        function: 'setController',
        target,
      },
    }).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should not set controller if already set',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [target] };
      const result = await setController(initState, {
        caller: 'test',
        input: {
          function: 'setController',
          target,
        },
      }).catch((e) => e);
      expect(result.message).toContain(target);
      expect(result.message).toContain('is already in the list of controllers');
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should not set controller as non-owner',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [] };
      const result = await setController(initState, {
        caller: target,
        input: {
          function: 'setController',
          target,
        },
      }).catch((e) => e);
      expect(result.message).toEqual(NON_CONTRACT_OWNER_MESSAGE);
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should set controller',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [] };
      const result = (await setController(initState, {
        caller: 'test',
        input: {
          function: 'setController',
          target,
        },
      })) as AntContractWriteResult;
      expect(result.state.controllers).toEqual([target]);
    },
  );
});
