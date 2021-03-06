import { MAX_NAME_LENGTH, TX_ID_LENGTH, MIN_TTL_LENGTH, MAX_TTL_LENGTH } from "@/constants";
import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setRecord = async (
  state: ANTState,
  { caller, input: { subDomain, transactionId, ttlSeconds } }: PstAction
): Promise<ContractResult> => {
  const owner = state.owner;
  const controller = state.controller;

  // ensure the owner owns this ANT
  if (caller !== owner && caller !== controller) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  // check subdomain validity
  const namePattern = new RegExp("^[a-zA-Z0-9_-]+$"); // include underscores and dashes
  // NEED TO CHECK FOR LEADING DASHES
  const nameRes = namePattern.test(subDomain);
  if (
    typeof subDomain !== "string" || // must be a string
    subDomain.length > MAX_NAME_LENGTH || // the name is too long
    (!nameRes && subDomain !== "@") || // the name does not match our regular expression and is not the root
    subDomain === "www" // this is a reserved name
  ) {
    throw new ContractError("Invalid ArNS Record Subdomain");
  }

  // check subdomain arweave transaction id validity
  const pattern = new RegExp("^[a-zA-Z0-9_-]{43}$"); // standard regex for arweave transaction ids
  const res = pattern.test(transactionId);
  if (
    typeof transactionId !== "string" || // must be a string
    transactionId.length !== TX_ID_LENGTH || // the tx id is too long
    !res
  ) {
    throw new ContractError("Invalid Arweave Transaction ID");
  }

  // set ttlSeconds to default if not provided
  if (ttlSeconds === undefined) {
    ttlSeconds = MIN_TTL_LENGTH;
  }

  // check subdomain ttlSeconds
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < MIN_TTL_LENGTH || ttlSeconds > MAX_TTL_LENGTH) {
    throw new ContractError('Invalid value for "ttlSeconds". Must be an integer');
  }
  
  state.records[subDomain] = {
    transactionId,
    ttlSeconds
  };

  return { state };
};
