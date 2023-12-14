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
export function constructor(state, action) {
  if (action.input.args) {
    state = {
      records: state.records,
      controllers: state.controllers,
      ...action.input.args,
    };
  }

  if (!state.claimable) {
    state.claimable = [];
  }

  if (!state.balances) {
    state.balances = {};
  }

  if (!action.input?.args?.balances) {
    state.balances[action.caller] = 100;
  }

  state.name = action.input?.args?.name
    ? action.input.args.name
    : 'AtomicAsset';
  state.ticker = action.input?.args?.ticker ? action.input.args.ticker : 'AA';

  return { state };
}
