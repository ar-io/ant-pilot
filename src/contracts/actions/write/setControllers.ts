import { PstAction, ANTState, ContractResult } from "../../types/types";
import { validateSetControllers } from "../../../validations.mjs";
import { INVALID_INPUT_MESSAGE } from "@/constants";

declare const ContractError;

export const setControllers = async (
  state: ANTState,
  { caller, input }: PstAction
): Promise<ContractResult> => {
  const { targets } = input;
  const owner = state.owner;

  if (!validateSetControllers(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (!targets) {
    throw new ContractError("No target specified");
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  targets.forEach((target) => {
    if (state.controllers.includes(target)) {
      throw new ContractError(
        `Target address ${target} is already in the list of controllers`
      );
    }
  });

  state.controllers = [...state.controllers, ...targets];
  return { state };
};
