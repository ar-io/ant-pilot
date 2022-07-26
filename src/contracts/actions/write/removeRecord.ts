import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const removeRecord = async (
  state: ANTState,
  { caller, input: { subDomain } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const records = state.records;
  const controller = state.controller;

  if (caller !== owner && caller !== controller) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  if (subDomain in records) {
    delete records[subDomain];
  } else {
    throw new ContractError(`SubDomain does not exist in this ANT!`);
  }

  return { state };
};
