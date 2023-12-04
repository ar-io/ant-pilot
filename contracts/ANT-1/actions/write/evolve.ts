import { NON_CONTRACT_OWNER_MESSAGE } from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';

declare const ContractError;

// Updates this contract to new source code
export const evolve = async (
  state: ANTState,
  { caller, input: { value } }: PstAction,
): Promise<ContractResult> => {
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  state.evolve = value.toString();

  return { state };
};
