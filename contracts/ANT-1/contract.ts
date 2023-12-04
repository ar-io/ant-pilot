// ~~ Put all the interactions from '../actions/` together to write the final handle function which will be exported
// from the contract source. ~~
import { balance } from './actions/read/balance';
import { evolve } from './actions/write/evolve';
import { removeController } from './actions/write/removeController';
import { removeRecord } from './actions/write/removeRecord';
import { setController } from './actions/write/setController';
import { setName } from './actions/write/setName';
import { setRecord } from './actions/write/setRecord';
import { setTicker } from './actions/write/setTicker';
import { transferTokens } from './actions/write/transferTokens';
import { ANTState, ContractResult, PstAction } from './types';

declare const ContractError;

export async function handle(
  state: ANTState,
  action: PstAction,
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'transfer':
      return await transferTokens(state, action);
    case 'setRecord':
      return await setRecord(state, action);
    case 'setName':
      return await setName(state, action);
    case 'setTicker':
      return await setTicker(state, action);
    case 'setController':
      return await setController(state, action);
    case 'removeController':
      return await removeController(state, action);
    case 'removeRecord':
      return await removeRecord(state, action);
    case 'balance':
      return await balance(state, action);
    case 'evolve':
      return await evolve(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`,
      );
  }
}
