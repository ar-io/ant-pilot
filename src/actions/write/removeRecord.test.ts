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
  MAX_NAME_LENGTH,
  MIN_TTL_LENGTH,
  NON_CONTRACT_OWNER_CONTROLLER_MESSAGE,
  NON_CONTRACT_OWNER_MESSAGE,
  baselineAntState,
} from '../../../tests/utils/constants';
import { removeRecord } from './removeRecord';

describe('removeRecord', () => {
  it.each([
    undefined,
    false,
    1,
    0,
    Infinity,
    -1,
    '$',
    '%',
    '=',
    '?'.padEnd(MAX_NAME_LENGTH + 1, '1'),
  ])('should throw on bad domain', async (subDomain: any) => {
    const initState = {
      ...baselineAntState,
      records: {
        [subDomain]: {
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: MIN_TTL_LENGTH,
        },
      },
    };
    const result = await removeRecord(initState, {
      caller: 'test',
      input: {
        function: 'removeRecord',
        subDomain,
      },
    }).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should not remove domain as non-owner or controller',
    async (hacker: string) => {
      const initState = {
        ...baselineAntState,
        records: {
          subDomain: {
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      };
      const result = await removeRecord(initState, {
        caller: hacker,
        input: {
          function: 'removeRecord',
          subDomain: 'subDomain',
        },
      }).catch((e) => e);
      expect(result.message).toEqual(NON_CONTRACT_OWNER_CONTROLLER_MESSAGE);
    },
  );

  it.each(['fibonachi', 'sequence1', 'tetra-hedron'])(
    'should throw if domain not a record',
    async (subDomain: string) => {
      const initState = { ...baselineAntState, controllers: [] };
      const result = await removeRecord(initState, {
        caller: 'test',
        input: {
          function: 'removeRecord',
          subDomain,
        },
      }).catch((e) => e);

      expect(result.message).toEqual('SubDomain does not exist in this ANT!');
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should remove domain as owner',
    async (owner: string) => {
      const initState = {
        ...baselineAntState,
        owner,
        records: {
          subDomain: {
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      };
      const result = (await removeRecord(initState, {
        caller: owner,
        input: {
          function: 'removeRecord',
          subDomain: 'subDomain',
        },
      })) as AntContractWriteResult;
      expect(result.state.records).toEqual({});
    },
  );

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should remove domain as controller',
    async (controller: string) => {
      const initState = {
        ...baselineAntState,
        controllers: [controller],
        records: {
          subDomain: {
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      };
      const result = (await removeRecord(initState, {
        caller: controller,
        input: {
          function: 'removeRecord',
          subDomain: 'subDomain',
        },
      })) as AntContractWriteResult;
      expect(result.state.records).toEqual({});
    },
  );
});
