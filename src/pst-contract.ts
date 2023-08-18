import Arweave from "arweave";
import { Warp, WarpFactory, defaultCacheOptions } from "warp-contracts";

export const arweave: Arweave = Arweave.init({
  //host: "testnet.redstone.tools",
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export const smartweave: Warp = WarpFactory.forMainnet(
  {...defaultCacheOptions, inMemory:true},
  true,
  arweave
)