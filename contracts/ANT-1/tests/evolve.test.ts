import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import fs from "fs";
import path from "path";
import { ANTState } from "../types";
import { ANTDeployer } from "../utils";

describe("Testing evolve...", () => {
  const _arweave: Arweave = global.arweave;
  const _wallets: Record<string, JWKInterface> = global.wallets;
  const _warp: Warp = global.warp;
  const defaultOwner = Object.entries(_wallets)[0];

  let _srcTxId: string;

  beforeEach(async () => {
    const contractSource = fs.readFileSync(
      path.join(__dirname, "../dist/contract.js"),
      "utf8"
    );
    const srcTx = await _warp.createSource(
      { src: contractSource },
      Object.values(_wallets)[0],
      true
    );
    _srcTxId = await _warp.saveSource(srcTx, true);
    await mineBlock(_arweave);
  });

  it("Should evolve the ANT", async () => {
    const ANT = await ANTDeployer(_warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(_arweave);

    const contract = _warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const evolveResult = await contract.evolve(_srcTxId);
    await mineBlock(_arweave);
    const { cachedValue } = await contract.readState();

    expect(evolveResult?.originalTxId).toBeDefined();
    expect(cachedValue.state.evolve).toEqual(_srcTxId);
  });
});
