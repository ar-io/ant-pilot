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

import { TokenConfig } from "./types"

export async function validateExternalTokenTransfer({tags, tokenId, config, owner}:{tags: any[], tokenId: string, config:TokenConfig, owner: string}): Promise<number> {
    let qty = 0
    const { transferFunction, recipientArg, quantityArg } = config
    try {
        const input = tags.reduce((acc, tag, index) => {
        if (tag.name === 'Contract' && tag.value === tokenId) {
            acc = JSON.parse(tags[index + 1].value) 
        }
        return acc
    }, {})

    if (!input[quantityArg]|| input[quantityArg] <= 0) {
        throw new Error(`"${quantityArg}" is required and must be greater than 0`)
    }

    if (!input[recipientArg] || input[recipientArg] !== owner) {
        throw new Error(`"${recipientArg}" must be contract owner`)
    }
    if (input.function !== transferFunction) { // TODO: add support for other transfer function eg transferFrom
        throw new Error(`function must be "${transferFunction}"`)
    }
    const { state, validity, errorMessages } = await SmartWeave.contracts.readContractState(tokenId, true)

    if (!validity[SmartWeave.transaction.id]) {
        throw new Error(`Token transfer is not valid [Error: ${errorMessages[SmartWeave.transaction.id]}]`)
    }
    if (!state.balances) {
        throw new Error('Token state must have balances - the contract is not a valid token contract')
    }
    if (!state.balances[owner]) {
        throw new Error('Transfer was valid but owner does not have a balance for this token')
    }

    qty = input.qty

    } catch (error) {
        throw new ContractError('Invalid token transfer: ' + error.message)
    }
    return qty

}

export const validateDirectRecordManagement = (state, caller, subDomain) => {
    const reservedRegex = new RegExp(state.reserved.pattern)
    if (!reservedRegex.test(subDomain)) {
        throw new ContractError('Subdomains must be reserved before they are directly managed')
    }

    if (state.records[subDomain] && state.records[subDomain].contractTxId) {
        throw new ContractError('Subdomains that are owned by a contract cannot be directly managed')
    }

    if (!state.controllers.includes(caller) && state.owner !== caller) {
        throw new ContractError('Caller must be owner or controller for direct record management')
    }
}