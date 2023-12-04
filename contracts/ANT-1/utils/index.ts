import { JWKInterface, Warp } from "warp-contracts";
import fs from "fs";
import path from "path";

// deploys a single ANT contract
export async function ANTDeployer(
  warp: Warp,
  deployer: {
    address: string;
    wallet: JWKInterface;
  }
): Promise<string> {
  const { address, wallet } = deployer;
  const sourceCode = fs.readFileSync(
    path.join(__dirname, "../dist/contract.js"),
    "utf8"
  );
  const initState = fs.readFileSync(
    path.join(__dirname, "../state.json"),
    "utf8"
  );
  let contractId = "";
  try {
    const ownerState = {
      ...JSON.parse(initState),
      owner: address,
      controllers: [address],
      balances: {
        ...JSON.parse(initState).balances,
        [address]: 1,
      },
    };

    const { contractTxId } = await warp.deploy(
      {
        src: sourceCode,
        initState: JSON.stringify(ownerState),
        wallet,
      },
      true
    );
    contractId = contractTxId;
  } catch (error) {
    console.error(error);
  }
  return contractId;
}
