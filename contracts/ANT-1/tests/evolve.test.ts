import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import fs from "fs";
import path from "path";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";

describe("Testing evolve...", () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const warp: Warp = global.warp;
  const defaultOwner = Object.entries(wallets)[0];

  let _srcTxId: string;

  beforeEach(async () => {
    const contractSource = fs.readFileSync(
      path.join(__dirname, "../dist/contract.js"),
      "utf8"
    );
    const srcTx = await warp.createSource(
      { src: contractSource },
      Object.values(wallets)[0],
      true
    );
    _srcTxId = await warp.saveSource(srcTx, true);
    await mineBlock(arweave);
  });

  it("Should evolve the ANT", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const evolveResult = await contract.evolve(_srcTxId);
    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();

    expect(evolveResult?.originalTxId).toBeDefined();
    expect(cachedValue.state.evolve).toEqual(_srcTxId);
  });
});
