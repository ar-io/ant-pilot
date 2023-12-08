import Arweave from 'arweave';
import { JWKInterface, Warp } from 'warp-contracts';

import { mineBlock } from '../../../tools/common/helpers';
import { ANTState } from '../types';
import { ANTDeployer } from '../utils';

describe('Testing removeController...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const warp: Warp = global.warp;
  const defaultOwner = Object.entries(wallets)[0];

  it('Should remove controller from the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const result = await contract.writeInteraction({
      function: 'removeController',
      target: defaultOwner[0],
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.controllers).not.toContain(defaultOwner[0]);
  });
});
