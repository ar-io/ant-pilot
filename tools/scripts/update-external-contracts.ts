import Arweave from 'arweave';
import fs from 'fs';
import path from 'path';
import {
  PstState,
  Tag,
  WarpFactory,
  defaultCacheOptions,
} from 'warp-contracts';

import { EXTERNAL_CONTRACTS } from '../../contracts/external';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});
const warp = WarpFactory.forMainnet(defaultCacheOptions, true);

async function main() {
  for (const [name, contractTxId] of Object.entries(EXTERNAL_CONTRACTS)) {
    console.dir(`Updating definition for ${name} [${contractTxId}]...`);

    let srcTxId;

    const contract = await warp
      .contract<PstState>(contractTxId)
      .syncState(`https://api.arns.app/v1/contract/${contractTxId}`);

    const {
      cachedValue: { state },
    } = (await contract.readState()) as any;

    console.dir(`Getting src tx id for ${name} [${contractTxId}]...`);
    if (state?.evolve) {
      console.dir(
        `Using evolve tx id for ${name} [${contractTxId}] of ${state.evolve}...`,
      );
      srcTxId = state.evolve;
    } else {
      const tagsRes = (await arweave.api
        .get(`/tx/${contractTxId}/tags`)
        .then((res) => res.json())) as any[];

      const tags = tagsRes.map(
        (tag: { name: string; value: string }) =>
          new Tag(tag.name, tag.value, true),
      );

      const srcTag = tags.find((tag: Tag) => tag.name === 'Contract-Src');
      if (!srcTag) {
        console.log(`No Contract-Src tag found for ${name}`);
        continue;
      }
      srcTxId = srcTag.value;
      console.dir(`Using original src tx id for ${name} [${contractTxId}]...`);
    }
    // get contract source code

    const contractSrc = await arweave.transactions.getData(srcTxId, {
      decode: true,
      string: true,
    });

    // write state and source to files

    const externalContractPath = path.join(
      __dirname,
      `../../contracts/external/${name}`,
    );
    fs.writeFileSync(
      `${externalContractPath}/state.json`,
      JSON.stringify(state),
    );
    fs.writeFileSync(`${externalContractPath}/source.js`, contractSrc);
  }
}

main();
