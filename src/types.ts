/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export type ANTRecord = {  
   transactionId: string,  
   ttlSeconds: number,  
} 

export type ANTState = {
  ticker: string; // A short token symbol, shown in block explorers and marketplaces
  name: string; // The friendly name of the token, shown in block explorers and marketplaces
  owner: string; // The owner of this contract who can execute specific methods
  controllers: string[]; // The controller of the records, who can add/change subdomains and their settings
  records: Record<string, ANTRecord>
  balances: {
    // A list of all outstanding, positive, token balances
    [address: string]: number;
  };
  evolve: string; // The new Smartweave Source Code transaction to evolve this contract to
};

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
  | 'transfer'
  | 'setRecord'
  | 'setName'
  | 'setTicker'
  | 'setController'
  | 'removeController'
  | 'removeRecord'
  | 'balance'
  | 'evolve';

export type ContractResult =
  | { state: ANTState }
  | { result: PstResult }
  | { result: ANTSubDomainResult };
