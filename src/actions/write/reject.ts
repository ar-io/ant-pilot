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
import { AntAction, ANTState } from 'src/types'
import { fromNullable, Left, Right } from '../../lib/either'

export function reject(state: ANTState, action: AntAction) {

  return fromNullable({state, action})
    .chain(validate)
    .map(update)
}

function update({state, action}) {
  const claim = state.claimable.find(c => c.txID === action.input.tx)
  
  if (!state.balances[claim.from]) {
    state.balances[claim.from] = 0
  }
  // add claim amount back to balance
  state.balances[claim.from] += claim.qty
  
  // remove claim
  state.claimable = state.claimable.filter(c => c.txID !== claim.txID)
  return {state}
}

function validate({state, action}) {
  if (!action.input.tx) {
    return Left('tx is required!')
  }
  if (!action.input.qty) {
    return Left('qty is required!')
  }
  if (action.input.tx.length !== 43) {
    return Left('tx is not valid')
  }
  if (!Number.isInteger(action.input.qty)) {
    return Left('qty must be an integer')
  }
  if (state.claimable.filter((c) => c.txID === action.input.tx).length !== 1) {
    return Left('claim not found')
  }
  if (state.claimable.filter((c) => c.txID === action.input.tx)[0]?.to !== action.caller) {
    return Left('claim in not addressed to caller')
  }

  return Right({state, action})
}