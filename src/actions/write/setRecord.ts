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
  NON_CONTRACT_OWNER_MESSAGE,
  TX_ID_LENGTH,
} from '../../constants';
import { ANTState, ContractResult, AntAction } from '../../types';
import { validateSetRecord } from '../../validations';

declare const ContractError;

// Sets an existing record and if one does not exist, it creates it
export const setRecord = async (
  state: ANTState,
  { caller, input }: AntAction,
): Promise<ContractResult> => {
  const { subDomain, transactionId, ttlSeconds } = input;
  const owner = state.owner;
  const controllers = state.controllers;

  if (!validateSetRecord(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  // ensure the owner owns this ANT
  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  if (subDomain === 'www') {
    throw new ContractError('Invalid ArNS Record Subdomain');
  }

  state.records[subDomain] = {
    transactionId,
    ttlSeconds,
  };

  return { state };
};
