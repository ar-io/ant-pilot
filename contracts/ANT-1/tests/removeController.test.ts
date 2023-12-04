import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";

describe("Testing removeController...", () => {
  const _arweave: Arweave = global.arweave;
  const _wallets: Record<string, JWKInterface> = global.wallets;
  const _warp: Warp = global.warp;
  const defaultOwner = Object.entries(_wallets)[0];

  it("Should remove controller from the ANT", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const result = await contract.writeInteraction({
      function: "removeController",
      target: defaultOwner[0],
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(_arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(state.controllers).not.toContain(defaultOwner[0]);
  });
});
