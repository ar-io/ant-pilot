import { JWKInterface } from "arweave/node/lib/wallet";
import { Warp } from "warp-contracts";

export type ContractDeployer = (
  warp: Warp,
  wallets: Record<string, JWKInterface>
) => Promise<string[]>;
