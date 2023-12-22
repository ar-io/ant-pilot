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
type TransactionOrigin = 'L1' | 'L2';

interface SWTransaction {
  readonly id: string;
  readonly owner: string;
  readonly target: string;
  readonly tags: {name: string, value: string}[];
  readonly sortKey: string;
  readonly dryRun: boolean;
  readonly quantity: number;
  readonly reward: number;
  readonly origin: TransactionOrigin;
}

interface SWBlock {
  readonly height: number;
  readonly indep_hash: string;
  readonly timestamp: number;
}

type SmartWeaveGlobal = {
    gasUsed: number;
    gasLimit: number;
    transaction: SWTransaction;
    block: SWBlock; 
    vrf: any; // SWVrf replaced with any
    evaluationOptions: any; // EvaluationOptions replaced with any
    arweave: Pick<any, 'ar' | 'wallets' | 'utils' | 'crypto'>; // Arweave replaced with any
    contract: {
        id: string;
        owner: string;
    };
    unsafeClient: any; // Arweave replaced with any
    baseArweaveUrl: string;
    safeArweaveGet: (input: RequestInfo | URL, init?: RequestInit) => Promise<unknown>;
    contracts: {
        readContractState: (contractId: string, returnValidity?: boolean) => Promise<any>;
        viewContractState: (contractId: string, input: any) => Promise<any>;
        write: (contractId: string, input: any) => Promise<any>;
        refreshState: () => Promise<any>;
    };
    extensions: any;
    _activeTx?: any; // GQLNodeInterface replaced with any
    caller?: string;
    kv: any; // KV replaced with any
    useGas(gas: number): void;
    getBalance(address: string, height?: number): Promise<string>;
}



declare let SmartWeave: SmartWeaveGlobal;
declare let ContractError: any;
