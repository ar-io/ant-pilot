import { PstAction, GNTState, ContractResult } from "../../types/types";

declare const ContractError;

export const balance = async (
  state: GNTState,
  { input: { target } }: PstAction
): Promise<ContractResult> => {
  const ticker = state.ticker;
  const owner = state.owner;

  if (typeof target !== "string") {
    throw new ContractError("Must specify target to get balance for");
  }

  return {
    result: { target, ticker, balance: target === owner ? 1 : 0 },
  };
};
