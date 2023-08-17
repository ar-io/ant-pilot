import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Updates this contract to new source code
export const evolve = async (
  state: ANTState,
  { caller, input: { value, version } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError("Caller cannot evolve the contract");
  }

  if (
    typeof version === "string" &&
    version.length <= 32 &&
    version !== state.version
  ) {
    state.version = version;
  } else {
    throw new ContractError("Invalid version provided");
  }

  state.evolve = value.toString();

  return { state };
};
