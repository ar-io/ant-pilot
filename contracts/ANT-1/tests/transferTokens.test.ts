import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";

describe("Testing transfer...", () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];

  const warp: Warp = global.warp;

  it("Should transfer balance to the correct address of the ANT", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: defaultOwner2[0],
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.balances[defaultOwner[0]]).toEqual(undefined);
    expect(newState.balances[defaultOwner2[0]]).toEqual(1);
    expect(newState.owner).toEqual(defaultOwner2[0]);
  });

  it("should not transfer with incorrect ownership", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;

    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: defaultOwner[0],
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    expect(newState.owner).toEqual(prevState.owner);
  });

  it("should not transfer with only controller ownership", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: "setController",
      target: defaultOwner2[0],
    });
    await mineBlock(arweave);
    contract.connect(defaultOwner2[1]); // this wallet is only a controller
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: defaultOwner[0],
      qty: 1,
    });

    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.owner).toEqual(prevState.owner);
  });
});
