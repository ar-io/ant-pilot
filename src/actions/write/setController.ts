import { PstAction, ANTState, ContractResult } from "../../contracts/types";
import { validateSetController } from '../../validations.mjs';
import { INVALID_INPUT_MESSAGE } from '../../contracts/constants';

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
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (state.controllers.includes(target)) {
    throw new ContractError(`Target address ${target} is already in the list of controllers`);
  }

  state.controllers.push(target);
  return { state };
};
