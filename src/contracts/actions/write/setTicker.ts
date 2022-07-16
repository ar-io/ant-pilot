import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setTicker = async (
  state: ANTState,
  { caller, input: { ticker } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const controller = state.controller;

  if (caller !== owner && caller !== controller) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  // check ticker validity
  if (
    typeof ticker !== "string" && // must be a string
    ticker === ""
  ) {
    throw new ContractError("Invalid ANT ticker");
  }
  state.ticker = ticker;

  return { state };
};
