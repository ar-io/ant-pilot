import Arweave from 'arweave';
import { JWKInterface, Warp } from 'warp-contracts';

import { mineBlock } from '../../../tools/common/helpers';
import { ANTState } from '../types';
import { ANTDeployer } from '../utils';

describe('Testing setTicker...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];
  const warp: Warp = global.warp;

  it('Should set the ticker of the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const ticker = 'my-new-ticker';

    const result = await contract.writeInteraction({
      function: 'setTicker',
      ticker,
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.ticker).toEqual(ticker);
  });

  it('should not set ticker with incorrect ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: 'setTicker',
      name: 'ANT-HACKED',
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.ticker).toEqual(prevState.ticker);
  });

  it('should set ticker as controller', async () => {
    const ticker = 'BIGFANCYTICKER';
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: 'setController',
      target: defaultOwner2[0],
    });
    await mineBlock(arweave);
    contract.connect(defaultOwner2[1]);
    await contract.writeInteraction({
      function: 'setTicker',
      ticker,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.ticker).toEqual(ticker);
  });
});
