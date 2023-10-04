import { PstAction, ANTState, ContractResult } from "../../types";
// composed by ajv at build
import { validateBalance } from '../../validations.mjs';
import { INVALID_INPUT_MESSAGE } from "../../constants";

declare const ContractError;

export const balance = async (
  state: ANTState,
  { input}: PstAction
): Promise<ContractResult> => {
  const ticker = state.ticker;
  const owner = state.owner;
  const { target } = input;

  if (!validateBalance(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }


  if (typeof target !== "string") {
    throw new ContractError("Must specify target to get balance for");
  }

  return {
    result: { target, ticker, balance: target === owner ? 1 : 0 },
  };
};
