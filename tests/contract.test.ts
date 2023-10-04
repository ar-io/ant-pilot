import ArLocal from "arlocal";
import Arweave from "arweave";
import { addFunds, mineBlock } from "./utils/helper";
import * as fs from "fs";
import path from "path";
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
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
import { ANTState } from "../src/types";

describe("ANT Tests", () => {
  let owner: JWKInterface;
  let controller: JWKInterface;
  let ownerAddress: string;
  let controllerAddress: string;
  let contract: Contract<PstState>;

  // Arlocal
  const arlocal = new ArLocal(1820, false);

  // Arweave
  const arweave = Arweave.init({
    host: 'localhost',
    port: 1820,
    protocol: 'http',
  });

  // Warp
  const warp = WarpFactory.forLocal(1820, arweave).use(new DeployPlugin());
  LoggerFactory.INST.logLevel('none');

  beforeAll(async () => {
    await arlocal.start();

    // ~~ Generate wallet and add funds ~~
    owner = await arweave.wallets.generate();
    ownerAddress = await arweave.wallets.jwkToAddress(owner);
    await addFunds(arweave, owner);

    controller = await arweave.wallets.generate();
    controllerAddress = await arweave.wallets.jwkToAddress(controller);
    await addFunds(arweave, controller);

    // pull source code
    const contractSrcJs = fs.readFileSync(
      path.join(__dirname, '../dist/contract.js'),
      'utf8',
    );

    // create initial contract
    const initialContractState = await setupInitialContractState(
      ownerAddress,
    );
    // deploy contract to arlocal
    const { contractTxId } = await warp.deploy(
      {
        wallet: owner,
        initState: JSON.stringify(initialContractState),
        src: contractSrcJs,
      },
      true, // disable bundling
    );

    // ~~ Mine block ~~
    await mineBlock(arweave);

    // ~~ Connect to the ANT contract ~~
    contract = warp.pst(contractTxId).connect(owner);
  });

  afterAll(async () => {
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
    console.log (newState)
  });
/*
  it("should set records with correct ownership", async () => {
    await contract.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: 1000,
      transactionId: "BYEeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    console.log ("current state: ", currentStateJSON)
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["same_as_root"]).toEqual({
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["dao"]).toEqual({
      transactionId: "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["remove_this"]).toEqual({
      transactionId: "BYEeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: 1000,
    });
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "DAOeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
  });

  it("should set name with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setName",
      name: "My New Token",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token");
  });

  it("should set controller with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setController",
      target: controllerAddress,
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.controller).toEqual(controllerAddress);
  });

  it("should set ticker with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setTicker",
      ticker: "ANT-NEWONE",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE");
  });

  it("should remove records with correct ownership", async () => {
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["remove_this"]).toEqual(undefined);
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });

  it("should not set malformed records with correct ownership", async () => {
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "bad record", // too short
    });
    await mineBlock(arweave);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1, // ttlSeconds too low
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1_000_000_000, // ttlSeconds too high
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900.5, // ttlSeconds should not be a decimal
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: "500", // ttlSeconds should not be a string
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs_Long_String", // too long
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "", // empty
      transactionId: "",
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records[""]).toEqual(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: 100000, // no string
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records[100000]).toEqual(undefined);

    await contract.writeInteraction({
      function: "setRecord",
      record: {
        subDomain: "@",
        transactionId: 1000000, // no string
      },
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6%dbBSkTouUShmnIA-pW4N-Hzs", // invalid character
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
  });

  it("should transfer and perform dry write with overwritten caller", async () => {
    const newWallet = await arweave.wallets.generate();
    const newWalletAddress = await arweave.wallets.jwkToAddress(newWallet);
    await addFunds(arweave, newWallet);

    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: newWalletAddress,
      qty: 1,
    });
    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.balances[newWalletAddress]).toEqual(1);
    const result: InteractionResult<PstState, unknown> = await contract.dryWrite(
      {
        function: "transfer",
        target: "NdZ3YRwMB2AMwwFYjKn1g88Y9nRybTo0qhS1ORq_E7g",
        qty: 1,
      },
      newWalletAddress
    );

    expect(result.state.owner).toEqual(
      "NdZ3YRwMB2AMwwFYjKn1g88Y9nRybTo0qhS1ORq_E7g"
    );
    contract.connect(newWallet);
    const writeInteraction2 = await contract.writeInteraction({
      function: 'transfer',
      target: ownerAddress,
      qty: 1,
    });
    await mineBlock(arweave);
    expect(writeInteraction2?.originalTxId).not.toBe(undefined);
    const { cachedValue: newCachedValue2 } = await contract.readState();
    const newState2 = newCachedValue2.state as ANTState;
    expect(newState2.balances[ownerAddress]).toEqual(1);
  });

  it("should not set records with incorrect ownership", async () => {
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    contract.connect(newWallet);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "Z2XhgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
    });
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "hacked.domain",
      transactionId: "HACKgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["hacked.domain"]).toEqual(undefined);
  });

  it("should not set name with incorrect ownership", async () => {
    await contract.writeInteraction({
      function: "setName",
      name: "HACKED",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token");
  });

  it("should not set controller with incorrect ownership", async () => {
    await contract.writeInteraction({
      function: "setController",
      target: "HACKED",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.controller).toEqual(controller);
  });

  it("should not set ticker with incorrect ownership", async () => {
    await contract.writeInteraction({
      function: "setTicker",
      name: "ANT-HACKED",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE");
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
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });

  it("should not transfer with incorrect ownership", async () => {
    const { cachedValue: prevCachedValue } = await contract.readState();
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    contract.connect(newWallet);
    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: ownerAddress,
      qty: 1,
    });
    await mineBlock(arweave);
    const { cachedValue: newCachedValue } = await contract.readState();
    expect(Object.keys(newCachedValue.errorMessages)).toContain(
      writeInteraction!.originalTxId,
    );
    expect(newCachedValue.state).toEqual(prevCachedValue.state);
  });

  it("should not transfer with only controller ownership", async () => {
    contract.connect(controller); // this wallet is only a controller

    const writeInteraction = await contract.writeInteraction({
      function: 'transfer',
      target: controller,
      qty: 1,
    });

    await mineBlock(arweave);
    expect(writeInteraction?.originalTxId).not.toBe(undefined);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.owner).toEqual(ownerAddress);
  });

  it("should set records as controller", async () => {
    contract.connect(controller); // this wallet is only a controller
    await contract.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "@",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await contract.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: 1000,
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["same_as_root"]).toEqual({
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["remove_this"]).toEqual({
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
      ttlSeconds: 1000,
    });
  });

  it("should set name as controller", async () => {
    await contract.writeInteraction({
      function: "setName",
      name: "My New Token Renamed",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token Renamed");
  });

  it("should set ticker as controller", async () => {
    await contract.writeInteraction({
      function: "setTicker",
      ticker: "ANT-NEWONE-RENAME",
    });
    await mineBlock(arweave);
    const currentState = await contract.readState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE-RENAME");
  });

  it("should remove records as controller", async () => {
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    let currentState = await contract.readState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["remove_this"]).toEqual(undefined);
    await contract.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await contract.readState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });*/
});
