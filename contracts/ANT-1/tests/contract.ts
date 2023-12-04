import Arweave from "arweave";
import { addFunds, mineBlock } from "./utils/helper";
import * as fs from "fs";
import path from "path";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import { Contract, LoggerFactory, PstState, WarpFactory } from "warp-contracts";
import { JWKInterface } from "arweave/node/lib/wallet";
import { setupInitialContractState } from "./utils/helper";
import { ANTState } from "../types";
import { MIN_TTL_LENGTH } from "../constants";

describe("ANT Tests", () => {
  let owner: JWKInterface;
  let ownerAddress: string;
  let owner2: JWKInterface;
  let ownerAddress2: string;
  let controller: JWKInterface;
  let controllerAddress: string;
  let controller2: JWKInterface;
  let controllerAddress2: string;

  let contract: Contract<PstState>;

  // Arlocal
  const arlocal = global.arlocal;

  // Arweave
  const arweave = Arweave.init({
    host: "localhost",
    port: 1820,
    protocol: "http",
  });

  // Warp
  const warp = WarpFactory.forLocal(1820, arweave).use(new DeployPlugin());
  LoggerFactory.INST.logLevel("error");

  beforeAll(async () => {
    await arlocal.start();

    // ~~ Generate wallet and add funds ~~
    owner = await arweave.wallets.generate();
    ownerAddress = await arweave.wallets.jwkToAddress(owner);
    await addFunds(arweave, owner);

    owner2 = await arweave.wallets.generate();
    ownerAddress2 = await arweave.wallets.jwkToAddress(owner2);
    await addFunds(arweave, owner2);

    controller = await arweave.wallets.generate();
    controllerAddress = await arweave.wallets.jwkToAddress(controller);
    await addFunds(arweave, controller);

    controller2 = await arweave.wallets.generate();
    controllerAddress2 = await arweave.wallets.jwkToAddress(controller2);
    await addFunds(arweave, controller2);

    // pull source code
    const contractSrcJs = fs.readFileSync(
      path.join(__dirname, "../dist/contract.js"),
      "utf8"
    );

    // create initial contract
    const initialContractState = await setupInitialContractState(ownerAddress);
    // deploy contract to arlocal
    const { contractTxId } = await warp.deploy(
      {
        wallet: owner,
        initState: JSON.stringify(initialContractState),
        src: contractSrcJs,
      },
      true // disable bundling
    );

    // ~~ Mine block ~~
    await mineBlock(arweave);

    // ~~ Connect to the ANT contract ~~
    contract = warp.pst(contractTxId).connect(owner);
  });

  afterAll(async () => {
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    // console.log(JSON.stringify(newState, null, 3));
    // ~~ Stop ArLocal ~~
    await arlocal.stop();
  });
});
