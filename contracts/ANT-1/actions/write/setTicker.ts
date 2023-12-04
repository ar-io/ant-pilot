import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
import { validateSetTicker } from '../../validations.mjs';

declare const ContractError;

// Sets the ticker for the ANT
export const setTicker = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const owner = state.owner;
  const controllers = state.controllers;
  const { ticker } = input;

  if (!validateSetTicker(input)) {
    console.log(input);
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(`Caller is not the token owner or controller!`);
  }

  // check ticker validity
  if (
    typeof ticker !== 'string' && // must be a string
    ticker === ''
  ) {
    throw new ContractError('Invalid ANT ticker');
  }
  state.ticker = ticker;

  return { state };
};
