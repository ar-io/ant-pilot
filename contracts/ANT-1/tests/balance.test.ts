import { JWKInterface, PstState, Warp } from "warp-contracts";
import Arweave from "arweave";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";

describe("Testing read balance...", () => {
  const arweave: Arweave = global.arweave;
  const warp: Warp = global.warp;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];

  it("Should retrieve balance of the owner", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    const contract = warp.contract<ANTState>(ANT);
    const { cachedValue } = await contract.readState();
    const { result } = (await contract.viewState({
      function: "balance",
      target: defaultOwner[0],
    })) as {
      result: { balance: number; target: string; ticker: string };
    };

    expect(result).toBeDefined();
    expect(result.balance).toEqual(1);
    expect(result.target).toEqual(defaultOwner[0]);
    expect(result.ticker).toEqual(cachedValue.state.ticker);
  });
});
