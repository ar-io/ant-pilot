import { PstState } from 'warp-contracts';

export type ANTState = PstState & {
  ticker: string; // A short token symbol, shown in block explorers and marketplaces
  name: string;   // The friendly name of the token, shown in block explorers and marketplaces
  owner: string;  // The owner of this contract who can execute specific methods
  controllers: string[]; // The controller of the records, who can add/change subdomains and their settings
  records: {     // A list of all subdomains and their corresponding Arweave Transaction IDs and TTLs
    [subDomain: string]: { // the subdomain used, default is the root @
      transactionId: string, // The transaction ID that the subdomain points to.
      ttlSeconds: number // The amount of time (in seconds) this transaction is cached for, default at 900 seconds
    }
  };
  balances: {
    // A list of all outstanding, positive, token balances
    [address: string]: number;
  };
  evolve: string; // The new Smartweave Source Code transaction to evolve this contract to
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
  value: string;
  subDomain: string;
  transactionId: string;
  qty: number;
  ttlSeconds: number;
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
  | "setController"
  | "removeController"
  | "removeRecord"
  | "balance";

export type ContractResult =
  | { state: ANTState }
  | { result: PstResult }
  | { result: ANTSubDomainResult };
