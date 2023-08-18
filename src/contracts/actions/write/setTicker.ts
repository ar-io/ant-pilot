import { PstAction, ANTState, ContractResult } from "../../types/types";
// composed by ajv at build
import { validateSetTicker } from '../../../validations.mjs';
import { INVALID_INPUT_MESSAGE } from "@/constants";
declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setTicker = async (
  state: ANTState,
  { caller, input }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const controllers = state.controllers;
  const { ticker } = input;

  if (!validateSetTicker(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && controllers.includes(caller)) {
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
