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
import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState, AntAction, ContractResult } from '../../types';
import { validateRemoveRecord } from '../../validations';

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const removeRecord = async (
  state: ANTState,
  { caller, input }: AntAction,
): Promise<ContractResult> => {
  const { subDomain } = input;
  const owner = state.owner;
  const records = state.records;
  const controllers = state.controllers;

  if (!validateRemoveRecord(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  if (subDomain in records) {
    delete records[subDomain];
  } else {
    throw new ContractError(`SubDomain does not exist in this ANT!`);
  }

  return { state };
};
