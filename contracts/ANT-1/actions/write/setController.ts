import { PstAction, ANTState, ContractResult } from "../../types";
import { validateSetController } from '../../validations.mjs';
import { INVALID_INPUT_MESSAGE, NON_CONTRACT_OWNER_MESSAGE } from '../../constants';

declare const ContractError;

export const setController = async (
  state: ANTState,
  { caller, input}: PstAction
): Promise<ContractResult> => {
 
  const { target } = input;
  const owner = state.owner;
  
  if (!validateSetController(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (!target) {
    throw new ContractError("No target specified");
  }

  if (caller !== owner) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  if (state.controllers.includes(target)) {
    throw new ContractError(`Target address ${target} is already in the list of controllers`);
  }

  state.controllers.push(target);
  return { state };
};
