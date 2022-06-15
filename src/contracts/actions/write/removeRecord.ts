import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;
const MAX_NAME_LENGTH = 20;
const TX_ID_LENGTH = 43;

// Sets an existing record and if one does not exist, it cre
export const removeRecord = async (
  state: ANTState,
  { caller, input: { subDomain } }: PstAction
): Promise<ContractResult> => {
  const balances = state.balances;
  const owner = state.owner;
  const records = state.records;

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  if (subDomain in records) {
    delete records[subDomain];
  } else {
    throw new ContractError(`SubDomain does not exist in this ANT!`);
  }

  return { state };
};
