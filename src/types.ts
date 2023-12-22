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
  transactionId: string;
  ttlSeconds: number;
};

export type ANTOwnableRecord = {
  contractTxId?: string;
  price?: number;
  buyer?: string;
  error?: string;
} & ANTRecord;

export type TokenConfig = {
  conversionRate: number;
  transferFunction: string;
  recipientArg: string;
  quantityArg: string;
};

export type ANTState = {
  ticker: string; // A short token symbol, shown in block explorers and marketplaces
  name: string; // The friendly name of the token, shown in block explorers and marketplaces
  owner: string; // The owner of this contract who can execute specific methods
  controllers: string[]; // The controller of the records, who can add/change subdomains and their settings
  records: Record<string, ANTOwnableRecord>;
  balances: Record<string, number>;
  reserved?: {
    pattern: string;
    subDomains: string[];
  };
  supportedTokens?: Record<string, TokenConfig & { revenue: number }>;
  evolve: string; // The new Smartweave Source Code transaction to evolve this contract to
};

export interface AntAction {
  input: { function: string } & AntInput;
  caller: string;
}

export interface AntInput {
  target?: string;
  name?: string;
  ticker?: string;
  value?: string;
  subDomain?: string;
  transactionId?: string;
  qty?: number;
  ttlSeconds?: number;
}

export interface AntReadResult {
  target: string;
  ticker: string;
  balance: number;
}

export interface ANTSubDomainResult {
  subDomain: string;
  transactionId: string;
}

export type AntFunction =
  | 'transfer'
  | 'setRecord'
  | 'setName'
  | 'setTicker'
  | 'setController'
  | 'removeController'
  | 'removeRecord'
  | 'balance'
  | 'evolve';

export type AntContractWriteResult = {
  state: ANTState;
};

export type AntContractReadResult = {
  result: AntContractReadResult | ANTSubDomainResult | unknown;
};

export type ContractResult = AntContractWriteResult | AntContractReadResult;
