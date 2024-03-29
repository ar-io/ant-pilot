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
  MAX_NAME_LENGTH,
  MIN_TTL_LENGTH,
  NON_CONTRACT_OWNER_CONTROLLER_MESSAGE,
} from '../../../src/constants';
import { AntContractWriteResult } from '../../../src/types';
import { baselineAntState } from '../../../tests/utils/constants';
import { setRecord } from './setRecord';

describe('setRecord', () => {
  it.each([''.padEnd(43, '_'), ''.padEnd(43, 'a'), ''.padEnd(43, '1')])(
    'should throw if not owner or controller',
    async (caller) => {
      const result = await setRecord(
        { ...baselineAntState },
        {
          caller,
          input: {
            function: 'setRecord',
            subDomain: 'domain',
            ttlSeconds: MIN_TTL_LENGTH,
            transactionId: caller,
          },
        },
      ).catch((e) => e);
      expect(result.message).toEqual(NON_CONTRACT_OWNER_CONTROLLER_MESSAGE);
    },
  );

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
    '-',
    '_',
    '3-',
    '-3',
    '3_',
    '_3',
  ])('should throw on bad subDomain', async (subDomain: any) => {
    const result = await setRecord(
      { ...baselineAntState },
      {
        caller: 'test',
        input: {
          function: 'setRecord',
          subDomain,
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: MIN_TTL_LENGTH,
        },
      },
    ).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each(['www'])(
    'should throw on invalid or reserved subDomain',
    async (subDomain: any) => {
      const result = await setRecord(
        { ...baselineAntState },
        {
          caller: 'test',
          input: {
            function: 'setRecord',
            subDomain,
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      ).catch((e) => e);
      expect(result.message).toEqual('Invalid ArNS Record Subdomain');
    },
  );

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
  ])('should throw on bad transactionId', async (transactionId: any) => {
    const result = await setRecord(
      { ...baselineAntState },
      {
        caller: 'test',
        input: {
          function: 'setRecord',
          subDomain: 'domain',
          transactionId,
          ttlSeconds: MIN_TTL_LENGTH,
        },
      },
    ).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

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
  ])('should throw on bad ttlSeconds', async (ttlSeconds: any) => {
    const result = await setRecord(
      { ...baselineAntState },
      {
        caller: 'test',
        input: {
          function: 'setRecord',
          subDomain: 'domain',
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds,
        },
      },
    ).catch((e) => e);
    expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
  });

  it.each([''.padEnd(43, '1'), ''.padEnd(43, 'a')])(
    'should set record as controller',
    async (controller: string) => {
      const initState = {
        ...baselineAntState,
        controllers: [controller],
      };
      const result = (await setRecord(initState, {
        caller: controller,
        input: {
          function: 'setRecord',
          subDomain: 'domain',
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: MIN_TTL_LENGTH,
        },
      })) as AntContractWriteResult;
      expect(result.state.records).toEqual({
        domain: {
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: MIN_TTL_LENGTH,
        },
      });
    },
  );

  it('should set record as owner', async () => {
    const result = (await setRecord(
      { ...baselineAntState },
      {
        caller: baselineAntState.owner,
        input: {
          function: 'setRecord',
          subDomain: 'domain',
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: MIN_TTL_LENGTH,
        },
      },
    )) as AntContractWriteResult;
    expect(result.state.records).toEqual({
      domain: { transactionId: ''.padEnd(43, '1'), ttlSeconds: MIN_TTL_LENGTH },
    });
  });

  it.each([
    ''.padEnd(61, '1'),
    ''.padEnd(61, 'a'),
    '1-'.padEnd(59, '1'),
    '1_'.padEnd(59, '1'),
    '1-_'.padEnd(58, '1'),
    '1_-'.padEnd(58, '1'),
  ])(
    'should set a record of max character length',
    async (subDomain: string) => {
      const result = (await setRecord(
        { ...baselineAntState },
        {
          caller: baselineAntState.owner,
          input: {
            function: 'setRecord',
            subDomain,
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      )) as AntContractWriteResult;
      expect(result.state.records[subDomain]).toEqual({
        transactionId: ''.padEnd(43, '1'),
        ttlSeconds: MIN_TTL_LENGTH,
      });
    },
  );

  it.each([
    ''.padEnd(162, '1'),
    ''.padEnd(62, '1'),
    ''.padEnd(62, 'a'),
    '1-'.padEnd(62, '1'),
    '1_'.padEnd(62, '1'),
    '1-_'.padEnd(62, '1'),
    '1_-'.padEnd(62, '1'),
  ])(
    'should not set a record exceeding max character length',
    async (subDomain: string) => {
      const result = await setRecord(
        { ...baselineAntState, records: {} },
        {
          caller: baselineAntState.owner,
          input: {
            function: 'setRecord',
            subDomain,
            transactionId: ''.padEnd(43, '1'),
            ttlSeconds: MIN_TTL_LENGTH,
          },
        },
      ).catch((e) => e);
      expect(result.message).toEqual(INVALID_INPUT_MESSAGE);
    },
  );
});
