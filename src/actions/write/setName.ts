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
import { ANTState, ContractResult, PstAction } from '../../types';
// composed by ajv at build
import { validateSetName } from '../../validations';

declare const ContractError;

// Sets an existing record and if one does not exist, it creates it
export const setName = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const { name } = input;
  const owner = state.owner;
  const controllers = state.controllers;

  if (!validateSetName(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  // check name validity
  if (
    typeof name !== 'string' || // must be a string
    name === ''
  ) {
    throw new ContractError('Invalid ANT name');
  }
  state.name = name;

  return { state };
};