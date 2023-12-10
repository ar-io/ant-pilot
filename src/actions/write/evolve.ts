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
} from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
// composed by ajv at build
import { validateEvolve } from '../../validations';

declare const ContractError;

// Updates this contract to new source code
export const evolve = async (
  state: ANTState,
  { caller, input: { value } }: PstAction,
): Promise<ContractResult> => {
  if (!validateEvolve({ value })) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  state.evolve = value.toString();

  return { state };
};
