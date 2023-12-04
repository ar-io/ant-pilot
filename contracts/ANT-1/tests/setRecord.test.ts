import { JWKInterface, Warp } from "warp-contracts";
import { mineBlock } from "../../../tools/common/helpers";
import Arweave from "arweave";
import { ANTState } from "../types";
import { MIN_TTL_LENGTH } from "../constants";
import { ANTDeployer } from "../utils";

describe("Testing setRecord...", () => {
  const arweave: Arweave = global.arweave;
  const wallets: Record<string, JWKInterface> = global.wallets;
  const defaultOwner = Object.entries(wallets)[0];
  const defaultOwner2 = Object.entries(wallets)[1];
  const warp: Warp = global.warp;

  beforeEach(async () => {
    // magic to kick start arlocal. Will return 404 in test for some reason
    await mineBlock(arweave).catch(() => null);
  });

  it("Should set the record of the ANT", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });

    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
    const subDomain = "test";

    const result = await contract.writeInteraction({
      function: "setRecord",
      subDomain,
      transactionId: defaultOwner[0],
      ttlSeconds: MIN_TTL_LENGTH,
    });

    expect(result).toBeDefined();
    expect(result?.originalTxId).toBeDefined();

    await mineBlock(arweave);
    const { cachedValue } = await contract.readState();
    const state = cachedValue.state;
    expect(Object.keys(state.records)).toContain(subDomain);
  });

  it("Should set other records with correct ownership", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
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

  it("Should set ANT root @ with correct ownership", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
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
  });

  it.each([
    {
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs", // too short
      ttlSeconds: -MIN_TTL_LENGTH,
    },
    {
      transactionId: "bad record", // too short
      ttlSeconds: MIN_TTL_LENGTH,
    },
    {
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1,
    },
    {
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 1_000_000_000,
    },
    {
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: 900.5,
    },
    {
      transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: "500",
    },
    {
      transactionId: "q8fnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs_Long_String", // too long
      ttlSeconds: MIN_TTL_LENGTH,
    },
    { transactionId: "", ttlSeconds: "" },
    { transactionId: "NEWnqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs" },
    {
      transactionId: "q8fnqsybd98-DRk6F6%dbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    },
  ])(
    "%#. Should not set malformed records with correct ownership",
    async (input) => {
      const ANT = await ANTDeployer(warp, {
        address: defaultOwner[0],
        wallet: defaultOwner[1],
      });
      await mineBlock(arweave);

      const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);
      const writeInteraction = await contract.writeInteraction({
        function: "setRecord",
        subDomain: "@",
        ...input,
      });
      await mineBlock(arweave);
      expect(writeInteraction?.originalTxId).not.toBe(undefined);
    }
  );

  it("should not set records with incorrect ownership", async () => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner2[1]);
    const { cachedValue: prevCachedValue } = await contract.readState();
    const prevState = prevCachedValue.state as ANTState;

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

  it.each([
    {
      subDomain: "@",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    },
    {
      subDomain: "same_as_root",
      transactionId: "CTRLqsybd98-DRk6F6wdbBSkTouUShmnIA-pW4N-Hzs",
      ttlSeconds: MIN_TTL_LENGTH,
    },
    {
      subDomain: "remove_this",
      ttlSeconds: MIN_TTL_LENGTH * 2,
      transactionId: "CTRLajVdPOhf3fCFDbrRuZXVRhhgNOJjbmgp8kjl2Jc",
    },
  ])("should set records as controller", async (input) => {
    const ANT = await ANTDeployer(warp, {
      address: defaultOwner[0],
      wallet: defaultOwner[1],
    });
    await mineBlock(arweave);

    const contract = warp.contract<ANTState>(ANT).connect(defaultOwner[1]);

    await contract.writeInteraction({
      function: "setController",
      target: defaultOwner2[0],
    });
    await mineBlock(arweave);

    contract.connect(defaultOwner2[1]); // this wallet is only a controller
    await contract.writeInteraction({
      function: "setRecord",
      ...input,
    });
    await mineBlock(arweave);

    const { cachedValue: newCachedValue } = await contract.readState();
    const newState = newCachedValue.state as ANTState;
    expect(newState.records[input.subDomain]).toEqual({
      transactionId: input.transactionId,
      ttlSeconds: input.ttlSeconds,
    });
  });

  //END DESCRIBE
});
