import ArLocal from "arlocal";
import Arweave from "arweave";
import { addFunds, mineBlock } from "../utils/_helpers";
import * as fs from "fs";
import path from "path";
import {
  ContractDeploy,
  InteractionResult,
  LoggerFactory,
  PstContract,
  PstState,
  Warp,
  WarpNodeFactory,
} from "warp-contracts";
import { JWKInterface } from "arweave/node/lib/wallet";

describe("Testing the ANT Contract", () => {
  let contractSrc: string;
  let wallet: JWKInterface;
  let wallet2: JWKInterface;
  let walletAddress: string;
  let walletAddress2: string;
  let initialState: PstState;
  let smartweave: Warp;
  let arweave: Arweave;
  let pst: PstContract;
  let deployedContract: ContractDeploy;
  const arlocal = new ArLocal(1820, false);
  beforeAll(async () => {
    // ~~ Set up ArLocal and instantiate Arweave ~~
    await arlocal.start();

    arweave = Arweave.init({
      host: "localhost",
      port: 1820,
      protocol: "http",
    });

    // ~~ Initialize 'LoggerFactory' ~~
    LoggerFactory.INST.logLevel("fatal");

    // ~~ Set up Warp ~~
    smartweave = WarpNodeFactory.forTesting(arweave);

    // ~~ Generate wallet and add funds ~~
    wallet = await arweave.wallets.generate();
    walletAddress = await arweave.wallets.jwkToAddress(wallet);
    await addFunds(arweave, wallet);

    wallet2 = await arweave.wallets.generate();
    walletAddress2 = await arweave.wallets.jwkToAddress(wallet2);
    await addFunds(arweave, wallet2);

    // ~~ Read contract source and initial state files ~~
    contractSrc = fs.readFileSync(
      path.join(__dirname, "../dist/contract.js"),
      "utf8"
    );
    const stateFromFile: PstState = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../dist/contracts/initial-state.json"),
        "utf8"
      )
    );

    // ~~ Update initial state ~~
    initialState = {
      ...stateFromFile,
      ...{
        owner: walletAddress,
        controller: walletAddress,
        balances: {
          [walletAddress]: 1,
        },
      },
    };

    // ~~ Deploy contract ~~
    deployedContract = await smartweave.createContract.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });

    // ~~ Connect to the pst contract ~~
    pst = smartweave.pst(deployedContract.contractTxId);
    pst.connect(wallet);

    // ~~ Mine block ~~
    await mineBlock(arweave);
  });

  afterAll(async () => {
    console.log("Final State:");
    console.log(await pst.currentState());
    // ~~ Stop ArLocal ~~
    await arlocal.stop();
  });

  it("should read pst state and balance data", async () => {
    console.log("Initial State:");
    console.log(await pst.currentState());
    expect(await pst.currentState()).toEqual(initialState);
    expect((await pst.currentState()).owner).toEqual(walletAddress);
  });

  it("should set records with correct ownership", async () => {
    await pst.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await pst.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "8MaeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: 1000,
      transactionId: "BYEeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
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
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "dao",
      transactionId: "DAOeajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
  });

  it("should set name with correct ownership", async () => {
    await pst.writeInteraction({
      function: "setName",
      name: "My New Token",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token");
  });

  it("should set controller with correct ownership", async () => {
    await pst.writeInteraction({
      function: "setController",
      target: walletAddress2,
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.controller).toEqual(walletAddress2);
  });

  it("should set ticker with correct ownership", async () => {
    await pst.writeInteraction({
      function: "setTicker",
      ticker: "ANT-NEWONE",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE");
  });

  it("should remove records with correct ownership", async () => {
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["remove_this"]).toEqual(undefined);
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });

  it("should not set malformed records with correct ownership", async () => {
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "bad record", // too short
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1, // ttlSeconds too low
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1_000_000_000, // ttlSeconds too high
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900.5, // ttlSeconds should not be a decimal
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: "500", // ttlSeconds should not be a string
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs_Long_String", // too long
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "", // empty
      transactionId: "",
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records[""]).toEqual(undefined);

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: 100000, // no string
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records[100000]).toEqual(undefined);

    await pst.writeInteraction({
      function: "setRecord",
      record: {
        subDomain: "@",
        transactionId: 1000000, // no string
      },
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });

    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "q8fnqsybd98-DRk6F6%dbBSkTouUShmnIA-pW4N-Hzs", // invalid character
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
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
    await pst.transfer({
      // transfer to new test wallet
      target: newWalletAddress,
      qty: 1,
    });

    await mineBlock(arweave);
    expect((await pst.currentState()).owner).toEqual(newWalletAddress);
    expect((await pst.currentState()).balances[newWalletAddress]).toEqual(1);
    expect((await pst.currentState()).balances[walletAddress]).toEqual(
      undefined
    );
    const result: InteractionResult<PstState, unknown> = await pst.dryWrite(
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
    pst.connect(newWallet);
    await pst.transfer({
      // Transfer back to original wallet
      target: walletAddress,
      qty: 1,
    });
    await mineBlock(arweave);
    expect((await pst.currentState()).owner).toEqual(walletAddress);
    expect((await pst.currentState()).balances[newWalletAddress]).toEqual(
      undefined
    );
    expect((await pst.currentState()).balances[walletAddress]).toEqual(1);
  });

  it("should not set records with incorrect ownership", async () => {
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    pst.connect(newWallet);
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "@",
      transactionId: "Z2XhgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
    });
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "hacked.domain",
      transactionId: "HACKgF0LtJhtWWihirRm7qQehoxDe01vReZyrFYkAc4",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    expect(currentStateJSON.records["hacked.domain"]).toEqual(undefined);
  });

  it("should not set name with incorrect ownership", async () => {
    await pst.writeInteraction({
      function: "setName",
      name: "HACKED",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token");
  });

  it("should not set controller with incorrect ownership", async () => {
    await pst.writeInteraction({
      function: "setController",
      target: "HACKED",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.controller).toEqual(walletAddress2);
  });

  it("should not set ticker with incorrect ownership", async () => {
    await pst.writeInteraction({
      function: "setTicker",
      name: "ANT-HACKED",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE");
  });

  it("should not remove records with incorrect ownership", async () => {
    const newWallet = await arweave.wallets.generate();
    await addFunds(arweave, newWallet);
    pst.connect(newWallet);
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "@",
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["@"]).toEqual({
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900,
    });
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });

  it("should not transfer with incorrect ownership", async () => {
    const newWallet = await arweave.wallets.generate();
    const newWalletAddress = await arweave.wallets.jwkToAddress(newWallet);
    await addFunds(arweave, newWallet);
    pst.connect(newWallet);
    await pst.transfer({
      // This wallet does not have a token so this transfer should not work
      target: walletAddress,
      qty: 1,
    });
    await mineBlock(arweave);
    expect((await pst.currentState()).owner).toEqual(walletAddress);
    expect((await pst.currentState()).balances[newWalletAddress]).toEqual(
      undefined
    );
    expect((await pst.currentState()).balances[walletAddress]).toEqual(1);
  });

  it("should not transfer with only controller ownership", async () => {
    pst.connect(wallet2); // this wallet is only a controller
    await pst.transfer({
      target: walletAddress2, // this will try to promote the controller to owner
      qty: 1,
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.owner).toEqual(walletAddress);
  });

  it("should set records as controller", async () => {
    pst.connect(wallet2); // this wallet is only a controller
    await pst.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "@",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await pst.writeInteraction({
      // If TTL is not passed, default of 900 is used
      function: "setRecord",
      subDomain: "same_as_root",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
    });
    await mineBlock(arweave);
    await pst.writeInteraction({
      function: "setRecord",
      subDomain: "remove_this",
      ttlSeconds: 1000,
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
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
    await pst.writeInteraction({
      function: "setName",
      name: "My New Token Renamed",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.name).toEqual("My New Token Renamed");
  });

  it("should set ticker as controller", async () => {
    await pst.writeInteraction({
      function: "setTicker",
      ticker: "ANT-NEWONE-RENAME",
    });
    await mineBlock(arweave);
    const currentState = await pst.currentState();
    const currentStateString = JSON.stringify(currentState);
    const currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.ticker).toEqual("ANT-NEWONE-RENAME");
  });

  it("should remove records as controller", async () => {
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "remove_this",
    });
    await mineBlock(arweave);
    let currentState = await pst.currentState();
    let currentStateString = JSON.stringify(currentState);
    let currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["remove_this"]).toEqual(undefined);
    await pst.writeInteraction({
      function: "removeRecord",
      subDomain: "fake.domain", // this doesnt exist
    });
    await mineBlock(arweave);
    currentState = await pst.currentState();
    currentStateString = JSON.stringify(currentState);
    currentStateJSON = JSON.parse(currentStateString);
    expect(currentStateJSON.records["fake.domain"]).toEqual(undefined);
  });
});
