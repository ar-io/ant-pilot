import { PstAction, GNTState, ContractResult } from "../../types/types";

declare const ContractError;

export const transferTokens = async (
  state: GNTState,
  { caller, input: { target } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const balances = state.balances;
  if (!target) {
    throw new ContractError("No target specified");
  }

  if (caller === target) {
    throw new ContractError("Invalid token transfer");
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  state.owner = target;
  delete balances[caller];
  balances[target] = 1;
  return { state };
};
