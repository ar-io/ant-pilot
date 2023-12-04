import {
  INVALID_INPUT_MESSAGE,
  MAX_NAME_LENGTH,
  MIN_TTL_LENGTH,
  NON_CONTRACT_OWNER_MESSAGE,
  TX_ID_LENGTH,
} from '../../constants';
import { ANTState, ContractResult, PstAction } from '../../types';
import { validateSetRecord } from '../../validations.mjs';

declare const ContractError;

// Sets an existing record and if one does not exist, it creates it
export const setRecord = async (
  state: ANTState,
  { caller, input }: PstAction,
): Promise<ContractResult> => {
  const { subDomain, transactionId, ttlSeconds } = input;
  const owner = state.owner;
  const controllers = state.controllers;

  if (!validateSetRecord(input)) {
    throw new ContractError(INVALID_INPUT_MESSAGE);
  }

  // ensure the owner owns this ANT
  if (caller !== owner && !controllers.includes(caller)) {
    throw new ContractError(NON_CONTRACT_OWNER_MESSAGE);
  }

  // check subdomain validity
  const namePattern = new RegExp('^[a-zA-Z0-9_-]+$'); // include underscores and dashes
  // NEED TO CHECK FOR LEADING DASHES
  const nameRes = namePattern.test(subDomain);
  if (
    typeof subDomain !== 'string' || // must be a string
    subDomain.length > MAX_NAME_LENGTH || // the name is too long
    (!nameRes && subDomain !== '@') || // the name does not match our regular expression and is not the root
    subDomain === 'www' // this is a reserved name
  ) {
    throw new ContractError('Invalid ArNS Record Subdomain');
  }

  // check subdomain arweave transaction id validity
  const pattern = new RegExp('^[a-zA-Z0-9_-]{43}$'); // standard regex for arweave transaction ids
  const res = pattern.test(transactionId);
  if (
    typeof transactionId !== 'string' || // must be a string
    transactionId.length !== TX_ID_LENGTH || // the tx id is too long
    !res
  ) {
    throw new ContractError('Invalid Arweave Transaction ID');
  }

  state.records[subDomain] = {
    transactionId,
    ttlSeconds,
  };

  return { state };
};
