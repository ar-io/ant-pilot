// ~~ Write types for your contract ~~
export interface ANTState {
  ticker: string; // A short token symbol, shown in block explorers and marketplaces
  name: string;   // The friendly name of the token, shown in block explorers and marketplaces
  owner: string;  // The owner of this contract who can execute specific methods
  records: {  // A list of all subdomains and their corresponding Arweave Transaction IDs
    [subDomain: string]: string
  };
  balances: { // A list of all outstanding, positive, token balances
    [address: string]: number;
  };
}

export interface PstAction {
  input: PstInput;
  caller: string;
}

export interface PstInput {
  function: PstFunction;
  target: string;
  name: string;
  ticker: string;
  evolve: string;
  value: string;
  subDomain: string;
  transactionId: string;
  qty: number;
}

export interface PstResult {
  target: string;
  ticker: string;
  balance: number;
}

export interface ANTSubDomainResult {
  subDomain: string;
  transactionId: string;
}

export type PstFunction =
  | "transfer"
  | "setRecord"
  | "setName"
  | "setTicker"
  | "removeRecord"
  | "balance";

export type ContractResult = { state: ANTState } | { result: PstResult } | { result: ANTSubDomainResult };
