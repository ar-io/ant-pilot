import Arweave from 'arweave';
import { JWKInterface, Warp } from 'warp-contracts';

import { mineBlock } from '../../../tools/common/helpers';
import { ANTState } from '../types';
import { ANTDeployer } from '../utils';

describe('Testing setName...', () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];
  const warp: Warp = global.warp;

  it('Should set the name of the ANT', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const name = 'my-new-name';

    const result = await contract.writeInteraction({
      function: 'setName',
      name,
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.name).toEqual(name);
  });

  it('should not set name with incorrect ownership', async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: 'setName',
      name: 'HACKED',
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual(prevState.name);
  });

  it('should set name as controller', async () => {
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
      function: 'setName',
      name: 'My New Token Renamed',
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual('My New Token Renamed');
  });
});
