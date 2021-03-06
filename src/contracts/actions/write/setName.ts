import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it creates it
export const setName = async (
  state: ANTState,
  { caller, input: { name } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const controller = state.controller;

  if (caller !== owner && caller !== controller) {
    throw new ContractError(`Caller is not the token owner or controller!`);
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
