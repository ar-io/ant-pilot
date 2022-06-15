import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setTicker = async (
  state: ANTState,
  { caller, input: { ticker } }: PstAction
): Promise<ContractResult> => {
  const balances = state.balances;
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  // check ticker validity
  if (
    typeof ticker !== "string" || // must be a string
    ticker === ""
  ) {
    throw new ContractError("Invalid ANT ticker");
  }
  state.ticker = ticker;

  return { state };
};
