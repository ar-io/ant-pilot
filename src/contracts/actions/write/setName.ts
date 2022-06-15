import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setName = async (
  state: ANTState,
  { caller, input: { name } }: PstAction
): Promise<ContractResult> => {
  const balances = state.balances;
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  // check name validity
  if (
    typeof name !== "string" || // must be a string
    name === ""
  ) {
    throw new ContractError("Invalid ANT name");
  }
  state.name = name;

  return { state };
};
