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
  NON_CONTRACT_OWNER_CONTROLLER_MESSAGE,
} from '../../constants';
import { ANTState, AntAction, ContractResult } from '../../types';
import { validateSetTicker } from '../../validations';

declare const ContractError;

// Sets the ticker for the ANT
export const setTicker = async (
  state: ANTState,
  { caller, input }: AntAction,
): Promise<ContractResult> => {
  const owner = state.owner;
  const controllers = state.controllers;
  const { ticker } = input;

  if (!validateSetTicker(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(NON_CONTRACT_OWNER_CONTROLLER_MESSAGE);
  }

  state.ticker = ticker;

  return { state };
};
