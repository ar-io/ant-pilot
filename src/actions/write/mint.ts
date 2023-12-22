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

import { validateExternalTokenTransfer } from "../../utils";
import { INVALID_INPUT_MESSAGE, PAYMENT_TYPES } from "../../constants";
import { validateMint } from '../../validations-undername-leasing'

export const mint = async (state,  { input, caller }) => {
    const { type, tokenId } = input
    const { supportedTokens, owner } = state
    const token = supportedTokens[type === PAYMENT_TYPES.ARWEAVE ? 'AR' : tokenId]
    let qty = 0

    if (!validateMint(input)) {
        throw new ContractError(INVALID_INPUT_MESSAGE)
    }

    if (type === PAYMENT_TYPES.ARWEAVE) {
        qty = +SmartWeave.transaction.quantity
    } else if (type === PAYMENT_TYPES.TOKEN && tokenId) {

        if (!Object.keys(supportedTokens).includes(tokenId)) {
        throw new ContractError('Unsupported token for minting')
        }

    const tags = SmartWeave.transaction.tags
    const price = await validateExternalTokenTransfer({
        tags, 
        tokenId,
        config: token, 
        owner
    })
    qty = +price
  
    }

    if (qty <= 0 || !Number.isInteger(qty)) {
        throw new ContractError(`Invalid payment amount: qty is less than or equal to 0, recieved ${qty} on type ${type}`)
    }
    state.balances[caller] = +qty * token.conversionRate
    state.supportedTokens[type === PAYMENT_TYPES.ARWEAVE ? 'AR' : tokenId].revenue += qty
    state.totalSupply = Object.values(state.balances).reduce((acc:number, balance:number) => acc + balance, 0)


return { state }
}