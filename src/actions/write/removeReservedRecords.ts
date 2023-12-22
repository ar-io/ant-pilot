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

import { INVALID_INPUT_MESSAGE } from '../../constants'
import { validateRemoveReservedRecords } from '../../validations-undername-leasing'
export const removeReservedRecords = async (state, { input, caller }) => {

    const { subDomains } = input 

    if (!validateRemoveReservedRecords(input)) {
        throw new ContractError(INVALID_INPUT_MESSAGE)
    }

    if (caller !== state.owner) {
        throw new ContractError('Caller must be contract owner to remove reserved records')
    }

    const reservedRecords = new Set([...state.reserved.subDomains].filter(subDomain => !subDomains.includes(subDomain)))
    const regexString = reservedRecords.size > 0 ? `(${[...reservedRecords].join('|')}|[${state.reserved.pattern}])` : ''

    state.reserved = {
        pattern: regexString,
        subDomains: reservedRecords,
    }

    return { state }
}