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
import { ANTState, AntAction, ContractResult } from '../../types';
import { validateSetController } from '../../validations';

declare const ContractError;

export const setController = async (
  state: ANTState,
  { caller, input }: AntAction,
): Promise<ContractResult> => {
  const { target } = input;
  const owner = state.owner;

  if (!validateSetController(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  if (state.controllers.includes(target)) {
    throw new ContractError(
      `Target address ${target} is already in the list of controllers`,
    );
  }

  state.controllers.push(target);
  return { state };
};
