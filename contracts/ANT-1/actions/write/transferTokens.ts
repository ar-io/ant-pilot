import { INVALID_INPUT_MESSAGE } from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
// composed by ajv at build
import {
  validateRemoveController,
  validateTransferTokens,
} from '../../validations.mjs';

declare const ContractError;

// Transfers the ANT token to another owner
export const transferTokens = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const owner = state.owner;
  const balances = state.balances;
  const { target } = input;

  if (!validateTransferTokens(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  if (!target) {
    throw new ContractError('No target specified');
  }

  if (caller === target) {
    throw new ContractError('Invalid token transfer');
  }

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (
    !balances[caller] ||
    balances[caller] == undefined ||
    balances[caller] == null ||
    isNaN(balances[caller])
  ) {
    throw new ContractError(`Caller balance is not defined!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  state.owner = target;
  delete balances[caller];
  balances[target] = 1;
  return { state };
};
