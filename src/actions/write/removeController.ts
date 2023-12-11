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
import { ANTState, ContractResult, AntAction } from '../../types';
// composed by ajv at build
import { validateRemoveController } from '../../validations';

declare const ContractError;

export const removeController = async (
  state: ANTState,
  { caller, input }: AntAction,
): Promise<ContractResult> => {
  const { target } = input;

  if (!validateRemoveController(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (!state.controllers.includes(target)) {
    throw new ContractError(`Target address ${target} is not a controller`);
  }

  state.controllers = state.controllers.filter(
    (controller) => controller !== target,
  );

  return { state };
};
