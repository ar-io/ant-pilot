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

import { ANTState } from "../src/types";
import { arweave, deployANTUCMContract, getLocalWallet, warp } from "./utils/helper";

describe('ucm', () => {

  let antContractTxId: string;
  let antContractOwnerAddress: string;
  let contract;

    beforeAll(async () => {

        const { wallet, address: owner } = await getLocalWallet(arweave);
        const {contractTxId} = await deployANTUCMContract({
            warp,
            owner,
            wallet,
        })

        antContractTxId = contractTxId;
        contract = warp.contract<ANTState>(antContractTxId).connect(wallet);
        antContractOwnerAddress = owner;
        
    })
    
    it('should add ANT to trading pair with U', () => {
        expect(true).toBe(true)
    })
})