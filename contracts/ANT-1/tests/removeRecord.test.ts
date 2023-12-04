import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import { ANTState } from "../types";
import { MIN_TTL_LENGTH } from "../constants";
import { ANTDeployer } from "../utils";

describe("Testing removeRecord...", () => {
  const _arweave: Arweave = global.arweave;
  const _wallets: Record<string, JWKInterface> = global.wallets;
  const _warp: Warp = global.warp;
  const defaultOwner = Object.entries(_wallets)[0];
  const defaultOwner2 = Object.entries(_wallets)[1];

  it("Should remove test record from the ANT", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const subDomain = "test";

    const setResult = await contract.writeInteraction({
      function: "setRecord",
      subDomain,
      transactionId: defaultOwner[0],
      ttlSeconds: MIN_TTL_LENGTH + 1,
    });

    expect(setResult).toBeDefined();
    expect(setResult?.originalTxId).toBeDefined();

    await mineBlock(_arweave);

    const result = await contract.writeInteraction({
      function: "removeRecord",
      subDomain,
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(_arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(Object.keys(state.records)).not.toContain(subDomain);
  });

  it("should not remove records with incorrect ownership", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "test",
      transactionId: defaultOwner[0],
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(_arweave);

    contract.connect(defaultOwner2[1]);
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "test",
    });
    await mineBlock(_arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["test"]).not.toEqual(undefined);
  });

  it("should remove record as controller", async () => {
    const subDomain = "BIGFANCYTICKER";
    const transactionId = "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc";
    const ttlSeconds = 1000;

    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: "setController",
      target: defaultOwner2[0],
    });
    await mineBlock(_arweave);

    contract.connect(defaultOwner2[1]);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain,
      transactionId,
      ttlSeconds,
    });
    await mineBlock(_arweave);

    await contract.writeInteraction({
      function: "removeRecord",
      subDomain,
    });
    await mineBlock(_arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records[subDomain]).toEqual(undefined);
  });
});
