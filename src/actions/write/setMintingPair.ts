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
import { ARWEAVE_ID_REGEX, INVALID_INPUT_MESSAGE } from "../../constants"
import { validateSetMintingPair } from '../../validations-undername-leasing'

export const setMintingPair = async (state, {input, caller}) => {

    const { tokenId, conversionRate, transferFunction, recipientArg, quantityArg } = input 
    const { owner } = state

    if (!validateSetMintingPair(input)) {
        throw new ContractError(INVALID_INPUT_MESSAGE)
    }

    // NOTE: Smartweaver validation tools should be used to validate the contract client side to check the required fields are present

    if (caller !== owner) {
        throw new ContractError('Caller must be contract owner to add token pair')
    }

    if (!ARWEAVE_ID_REGEX.test(tokenId)) {
        throw new ContractError('Token ID must be an arweave transaction ID')
    }

    state.supportedTokens[tokenId] = {
        conversionRate: conversionRate ?? 1,
        revenue: 0,
        transferFunction,
        recipientArg,
        quantityArg
    }

    return { state }
}