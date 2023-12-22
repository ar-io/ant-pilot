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
import { balance } from './actions/read/balance';
import { buyRecord } from './actions/write/buyRecord';
import { evolve } from './actions/write/evolve';
import { mint } from './actions/write/mint';
import { removeController } from './actions/write/removeController';
import { removeRecord } from './actions/write/removeRecord';
import { removeReservedRecords } from './actions/write/removeReservedRecords';
import { resolveRecords } from './actions/write/resolveRecords';
import { setController } from './actions/write/setController';
import { setMintingPair } from './actions/write/setMintingPair';
import { setName } from './actions/write/setName';
import { setRecord } from './actions/write/setRecord';
import { setReservedRecords } from './actions/write/setReservedRecords';
import { setTicker } from './actions/write/setTicker';
import { transferTokens } from './actions/write/transferTokens';
import { ANTState, AntAction, ContractResult } from './types';
import { validateDirectRecordManagement } from './utils';

declare const ContractError;

export async function handle(
  state: ANTState,
  action: AntAction,
): Promise<ContractResult> {
  const input = action.input;

  if (SmartWeave.transaction.origin !== 'L1') {
    // NOTE: this is a programmatic control that can be evolved to support L2 transactions, contracts should be deployed with SourceType "both"
    throw new ContractError('ANT can only be called from L1');
  }

  switch (input.function) {
    case 'transfer':
      return await transferTokens(state, action);
    case 'setRecord':{
    /**
     * NOTE: due to buyRecord, we need to protect record owners from direct control. To compose the setRecord without modifying it,
     * this access-control method is placed here, so as to avoid having to modify the setRecord action.
     */
      validateDirectRecordManagement(state, action.caller, input.subDomain)
      return await setRecord(state, action);
      }
    case 'removeRecord':{
      validateDirectRecordManagement(state, action.caller, input.subDomain)
      return await removeRecord(state, action);
      }
    case 'setName':
      return await setName(state, action);
    case 'setTicker':
      return await setTicker(state, action);
    case 'setController':
      return await setController(state, action);
    case 'removeController':
      return await removeController(state, action);
    case 'balance':
      return await balance(state, action);
      case 'setReservedRecords':
      return await setReservedRecords(state, action);
    case 'removeReservedRecords':
        return await removeReservedRecords(state, action);
    case 'setMintingPair':
        return await setMintingPair(state, action);
    case 'mint': 
        return await mint(state, action);
    case 'buyRecord':
        return await buyRecord(state, action);
    case 'resolveRecords':
      return await resolveRecords(state);
    case 'evolve':
      return await evolve(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`,
      );
  }
}
