import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

export const setController = async (
  state: ANTState,
  { caller, input: { target } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  if (!target) {
    throw new ContractError("No target specified");
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  state.controller = target;
  return { state };
};
