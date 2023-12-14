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
import { Left, Right, of } from '../../lib/either';

export const claim = (state, action) =>
  of({ state, action }).chain(validate).map(update);

function update({ state, action, idx }) {
  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0;
  }

  state.balances[action.caller] += action.input.qty;
  state.claimable.splice(idx, 1);

  return { state };
}

function validate({ state, action }) {
  if (!action.input.txID) {
    return Left('txID is not found.');
  }

  if (!action.input.qty) {
    return Left('claim quantity is not specified.');
  }

  const idx = state.claimable.findIndex((c) => c.txID === action.input.txID);

  if (idx < 0) {
    return Left('claimable not found.');
  }

  if (state.claimable[idx].qty !== action.input.qty) {
    return Left('claimable qty is not equal to claim qty.');
  }

  if (state.claimable[idx].to !== action.caller) {
    return Left('claim is not addressed to caller.');
  }

  return Right({ state, action, idx });
}
