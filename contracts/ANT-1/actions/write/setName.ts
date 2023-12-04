import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
// composed by ajv at build
import { validateSetName } from '../../validations.mjs';

declare const ContractError;

// Sets an existing record and if one does not exist, it creates it
export const setName = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const { name } = input;
  const owner = state.owner;
  const controllers = state.controllers;

  if (!validateSetName(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  // check name validity
  if (
    typeof name !== 'string' || // must be a string
    name === ''
  ) {
    throw new ContractError('Invalid ANT name');
  }
  state.name = name;

  return { state };
};
