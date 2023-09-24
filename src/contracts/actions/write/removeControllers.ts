import { PstAction, ANTState, ContractResult } from "../../types/types";
// composed by ajv at build
import { validateRemoveControllers } from "../../../validations.mjs";
import { INVALID_INPUT_MESSAGE } from "@/constants";

declare const ContractError;

export const removeControllers = async (
  state: ANTState,
  { caller, input }: PstAction
): Promise<ContractResult> => {
  const { targets } = input;

  if (!validateRemoveControllers(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  const owner = state.owner;
  if (!targets) {
    throw new ContractError("No controllers specified for removal");
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  targets.forEach((target) => {
    if (!state.controllers.includes(target)) {
      throw new ContractError(
        `Target address ${target} is not a controller, so cannot be removed!`
      );
    }
  });

  state.controllers = state.controllers.filter(
    (controller) => !targets.includes(controller)
  );

  return { state };
};
