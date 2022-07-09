import { MAX_NAME_LENGTH, TX_ID_LENGTH, MIN_TTL_LENGTH, MAX_TTL_LENGTH } from "@/constants";
import { PstAction, ANTState, ContractResult } from "../../types/types";

declare const ContractError;

// Sets an existing record and if one does not exist, it cre
export const setRecord = async (
  state: ANTState,
  { caller, input: { subDomain, transactionId, ttl } }: PstAction
): Promise<ContractResult> => {
  const balances = state.balances;
  const owner = state.owner;

  // ensure the owner owns this ANT
  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  // check subdomain validity
  const namePattern = new RegExp("^[a-zA-Z0-9_.-]+$"); // include underscores, dashes and dots
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

  // set ttl to default if not provided
  if (ttl === undefined) {
    ttl = MIN_TTL_LENGTH;
  }

  // check subdomain ttl
  if (!Number.isInteger(ttl) || ttl < MIN_TTL_LENGTH || ttl > MAX_TTL_LENGTH) {
    throw new ContractError('Invalid value for "ttl". Must be an integer');
  }
  
  state.records[subDomain] = [{
    transactionId,
    ttl
  }];

  return { state };
};
