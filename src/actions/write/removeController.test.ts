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
import { AntContractWriteResult } from 'src/types';

import {
  INVALID_INPUT_MESSAGE,
  NON_CONTRACT_OWNER_MESSAGE,
  baselineAntState,
} from '../../../tests/utils/constants';
import { removeController } from './removeController';

describe('removeController', () => {
  it.each([
    undefined,
    false,
    1,
    0,
    Infinity,
    -1,
    '?'.padEnd(42, '1'),
    ''.padEnd(44, '1'),
  ])('should throw on bad target', async (target: any) => {
    const initState = { ...baselineAntState, controllers: [target] };
    const result = await removeController(initState, {
      caller: 'test',
      input: {
        function: 'removeController',
        target,
      },
    }).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should not remove controller as non-owner',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [target] };
      const result = await removeController(initState, {
        caller: target,
        input: {
          function: 'removeController',
          target,
        },
      }).catch((e) => e);
      expect(result.message).toEqual(NON_CONTRACT_OWNER_MESSAGE);
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should throw if target not a controller',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [] };
      const result = await removeController(initState, {
        caller: 'test',
        input: {
          function: 'removeController',
          target,
        },
      }).catch((e) => e);

      expect(result.message).toContain('is not a controller');
      expect(result.message).toContain(target);
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should remove controller',
    async (target: string) => {
      const initState = { ...baselineAntState, controllers: [target] };
      const result = (await removeController(initState, {
        caller: 'test',
        input: {
          function: 'removeController',
          target,
        },
      })) as AntContractWriteResult;

      expect(result.state.controllers).not.toContain(target);
    },
  );
});
