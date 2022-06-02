import { PstAction, GNTState, ContractResult } from "../../types/types";

declare const ContractError;
const MAX_NAME_LENGTH = 20;
const TX_ID_LENGTH = 43;

// Sets an existing record and if one does not exist, it cre
export const setRecord = async (
  state: GNTState,
  { caller, input: { subDomain, transactionId } }: PstAction
): Promise<ContractResult> => {
  const balances = state.balances;
  const records = state.records;
  const owner = state.owner;

  if (caller !== owner) {
    throw new ContractError(`Caller is not the token owner!`);
  }

  if (balances[caller] < 1) {
    throw new ContractError(`Caller does not have a token balance!`);
  }

  // check record subdomain validity
  const namePattern = new RegExp("^[a-zA-Z0-9_.-]"); // include dots
  const nameRes = namePattern.test(subDomain);
  if (
    typeof subDomain !== "string" || // must be a string
    subDomain.length > MAX_NAME_LENGTH || // the name is too long
    (!nameRes && subDomain !== "@") || // the name does not match our regular expression and is not the root
    subDomain === "www" // this is a reserved name
  ) {
    throw new ContractError("Invalid GNS Record Subdomain");
  }

  // check record arweave transaction id validity
  const pattern = new RegExp("^[a-zA-Z0-9_-]{43}$"); // standard regex for arweave transaction ids
  const res = pattern.test(transactionId);
  if (
    typeof transactionId !== "string" || // must be a string
    transactionId.length !== TX_ID_LENGTH || // the tx id is too long
    !res
  ) {
    throw new ContractError("Invalid Arweave Transaction ID");
  }
  
  records[`${subDomain}`] = transactionId;

  return { state };
};
