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

import { INVALID_INPUT_MESSAGE, MIN_TTL_LENGTH } from "../../constants"
import { validateBuyRecord } from '../../validations-undername-leasing'

export async function buyRecord(state, { input, caller }) { 

    try {
    const { subDomain, contractTxId } = input

    const fee = state.fees[subDomain.length]
    const reservedRegex = new RegExp(state.reserved.pattern)

    if (!validateBuyRecord(input)) {
        throw new Error(INVALID_INPUT_MESSAGE)
    }

    if (reservedRegex.test(subDomain)) {
    throw new Error(`Subdomain ${subDomain} is reserved and cannot be purchased: ${state.reserved.pattern}`)
    }

    if (state.records[subDomain]) {
    throw new Error(`Subdomain ${subDomain} is permanently owned and will never EVER be available for purchase again`)
    }

    if (fee > state.balances[caller]) {
    throw new Error(`Caller does not have enough balance to purchase ${subDomain}`)
    }

        state.balances[caller] -= fee
        state.records[subDomain] = {
            contractTxId: contractTxId === 'atomic' ? SmartWeave.transaction.id : contractTxId,
            price: fee,
            buyer: caller,
            transactionId: '',
            ttlSeconds: MIN_TTL_LENGTH,
        }
        state.totalSupply -= fee

    } catch (error) {
        throw new ContractError(`Error executing buyRecord: ${error.message}`)
    }

    return { state }
}