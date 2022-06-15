// ~~ Write types for your contract ~~
export interface ANTState {
  ticker: string;
  name: string;
  owner: string;
  evolve: string;
  records: {
    [subDomain: string]: string
  };
  balances: {
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
  | "evolve"
  | "removeRecord"
  | "balance";

export type ContractResult = { state: ANTState } | { result: PstResult } | { result: ANTSubDomainResult };
