import { JWKInterface } from "arweave/node/lib/wallet";
import { Warp } from "warp-contracts";

export type ContractDeployer = (
  warp: Warp,
  wallets: Record<string, JWKInterface>
  // returns a string array of deployed contract IDs
) => Promise<Record<string, string[]>[]>;
