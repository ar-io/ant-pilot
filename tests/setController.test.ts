import def from 'ajv/dist/vocabularies/discriminator';
import Arweave from 'arweave';
import { JWKInterface, Warp } from 'warp-contracts';

import { mineBlock } from '../../../tools/common/helpers';
import { ANTState } from '../types';
import { ANTDeployer } from '../utils';

describe('Testing setController...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const warp: Warp = global.warp;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];

  it('Should add controller to the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const result = await contract.writeInteraction({
      function: 'setController',
      target: defaultOwner2[0],
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.controllers).toContain(defaultOwner2[0]);
  });

  it('should not set controller with incorrect ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);

    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: 'setController',
      target: 'HACKED',
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.controllers).toEqual(prevState.controllers);
  });
});
