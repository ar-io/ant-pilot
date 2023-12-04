import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
import { validateRemoveRecord } from '../../validations.mjs';

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const removeRecord = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const { subDomain } = input;
  const owner = state.owner;
  const records = state.records;
  const controllers = state.controllers;

  if (!validateRemoveRecord(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  if (subDomain in records) {
    delete records[subDomain];
  } else {
    throw new ContractError(`SubDomain does not exist in this ANT!`);
  }

  return { state };
};
