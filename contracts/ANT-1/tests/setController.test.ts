import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";
import def from "ajv/dist/vocabularies/discriminator";

describe("Testing setController...", () => {
  const _arweave: Arweave = global.arweave;
  const _wallets: Record<string, JWKInterface> = global.wallets;
  const _warp: Warp = global.warp;
  const defaultOwner = Object.entries(_wallets)[0];
  const defaultOwner2 = Object.entries(_wallets)[1];

  it("Should add controller to the ANT", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    const result = await contract.writeInteraction({
      function: "setController",
      target: defaultOwner2[0],
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(_arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.controllers).toContain(defaultOwner2[0]);
  });

  it("should not set controller with incorrect ownership", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);

    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "setController",
      target: "HACKED",
    });
    await mineBlock(_arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.controllers).toEqual(prevState.controllers);
  });
});