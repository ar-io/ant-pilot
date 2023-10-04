import { PstAction, ANTState, ContractResult } from "../../contracts/types";
// composed by ajv at build
import { validateRemoveController } from '../../validations.mjs';
import { INVALID_INPUT_MESSAGE } from '../../contracts/constants';

declare const ContractError;

export const removeController = async (
  state: ANTState,
  { caller, input }: PstAction
): Promise<ContractResult> => {
  const {target} = input;

  if (!validateRemoveController(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  const owner = state.owner;
  if (!target) {
    throw new ContractError("No target specified");
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (!state.controllers.includes(target)) {
    throw new ContractError(`Target address ${target} is not a controller`);
  }

  state.controllers = state.controllers.filter((controller) => controller !== target);

  return { state };
};
