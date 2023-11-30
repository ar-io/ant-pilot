import ArLocal from "arlocal";
import Arweave from "arweave";
import { addFunds, mineBlock } from "./utils/helper";
import * as fs from "fs";
import path from "path";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import {
  Contract,
  ContractDeploy,
  InteractionResult,
  LoggerFactory,
  PstState,
  WarpFactory,
} from "warp-contracts";
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
  const arlocal = new ArLocal(1820, false);

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
    console.log(JSON.stringify(newState, null, 3));
    // ~~ Stop ArLocal ~~
    await arlocal.stop();
  });

  it("should read pst state and balance data", async () => {
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.balances[ownerAddress]).toEqual(1);
  });

  it("should set ANT root @ with correct ownership", async () => {
    const writeInteraction = await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["@"]).toEqual({
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    console.log(newState);
  });

  it("should set other records with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: 1000,
      transactionId: "BYEeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["same_as_root"]).toEqual({
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    expect(newState.records["dao"]).toEqual({
      transactionId: "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    expect(newState.records["remove_this"]).toEqual({
      transactionId: "BYEeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: 1000,
    });
  });

  it("should update record subdomain and ttlseconds with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "DAOeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: MIN_TTL_LENGTH * 10,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["dao"]).toEqual({
      transactionId: "DAOeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: MIN_TTL_LENGTH * 10,
    });
  });

  it("should set name with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setName",
      name: "My New Token",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual("My New Token");
  });

  it("should set multiple controllers with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setController",
      target: controllerAddress,
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setController",
      target: controllerAddress2,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.controllers).toContain(controllerAddress);
    expect(newState.controllers).toContain(controllerAddress2);
  });

  it("should set ticker with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setTicker",
      ticker: "ANT-NEWONE",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.ticker).toEqual("ANT-NEWONE");
  });

  it("should remove records with correct ownership", async () => {
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["remove_this"]).toEqual(undefined);
  });

  it("should not set malformed records with correct ownership", async () => {
    let writeInteraction = await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "bad record", // too short
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    writeInteraction = await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1, // ttlSeconds too low
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    writeInteraction = await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1_000_000_000, // ttlSeconds too high
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900.5, // ttlSeconds should not be a decimal
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: "500", // ttlSeconds should not be a string
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs_Long_String", // too long
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "", // empty
      transactionId: "",
      ttlSeconds: "",
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: 100000, // no string
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      record: {
        subDomain: "@",
        transactionId: 1000000, // no string
        ttlSeconds: MIN_TTL_LENGTH,
      },
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6%dbBSkTouUShmnIA-pW4N-Hzs", // invalid character
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
  });

  it("should transfer ANT to another owner", async () => {
    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: ownerAddress2,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.balances[ownerAddress]).toEqual(undefined);
    expect(newState.balances[ownerAddress2]).toEqual(1);
    expect(newState.owner).toEqual(ownerAddress2);
  });

  it("should not set records with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    contract.connect(newWallet);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "Z2XhgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "hacked.domain",
      transactionId: "HACKgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records).toEqual(prevState.records);
  });

  it("should not set name with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "setName",
      name: "HACKED",
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual(prevState.name);
  });

  it("should not set controller with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "setController",
      target: "HACKED",
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.controllers).toEqual(prevState.controllers);
  });

  it("should not set ticker with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "setTicker",
      name: "ANT-HACKED",
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.ticker).toEqual(prevState.ticker);
  });

  it("should not remove records with incorrect ownership", async () => {
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    contract.connect(newWallet);
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "@",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["@"]).not.toEqual(undefined);
  });

  it("should not transfer with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    contract.connect(newWallet);
    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: ownerAddress,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    expect(newState.owner).toEqual(prevState.owner);
  });

  it("should not transfer with only controller ownership", async () => {
    contract.connect(controller); // this wallet is only a controller
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;
    const writeInteraction = await contract.writeInteraction({
      function: "transfer",
      target: controller,
      qty: 1,
    });

    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.owner).toEqual(prevState.owner);
  });

  it("should set records as controller", async () => {
    contract.connect(controller); // this wallet is only a controller
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: MIN_TTL_LENGTH * 2,
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["@"]).toEqual({
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    expect(newState.records["same_as_root"]).toEqual({
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    });
    expect(newState.records["remove_this"]).toEqual({
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: MIN_TTL_LENGTH * 2,
    });
  });

  it("should set name as controller", async () => {
    await contract.writeInteraction({
      function: "setName",
      name: "My New Token Renamed",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.name).toEqual("My New Token Renamed");
  });

  it("should set ticker as controller", async () => {
    await contract.writeInteraction({
      function: "setTicker",
      ticker: "ANT-CONTROLLER-RENAME",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.ticker).toEqual("ANT-CONTROLLER-RENAME");
  });

  it("should remove records as controller", async () => {
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records["remove_this"]).toEqual(undefined);
  });
});
