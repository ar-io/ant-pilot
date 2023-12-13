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
import { of, Left, Right } from '../../lib/either'

export const allow = (state, action) => of({ state, action })
  .chain(validate)
  .map(update)

function update({ state, action }) {
  state.balances[action.caller] -= action.input.qty;
  if (!state.claimable) {
    state.claimable = [];
  }
  state.claimable.push({
    from: action.caller,
    to: action.input.target,
    qty: action.input.qty,
    txID: SmartWeave.transaction.id,
  });
  return { state };
}

function validate({ state, action }) {
  if (
    !Number.isInteger(action.input.qty) ||
    action.input.qty === undefined
  ) {
    return Left("Invalid value for quantity. Must be an integer.");
  }
  if (!action?.input?.target) {
    return Left("No target specified.");
  }
  if (action.input.target.length !== 43) {
    return Left("Target is not valid!");
  }
  if (action.input.target === SmartWeave.transaction.id) {
    return Left("Cant setup claim to transfer a balance to itself");
  }
  if (action.caller === action.input.target) {
    return Left("Invalid balance transfer");
  }
  if (!state.balances[action.caller]) {
    return Left("Caller does not have a balance");
  }
  if (state.balances[action.caller] < action.input.qty) {
    return Left("Caller balance is not high enough.");
  }
  return Right({ state, action });
}