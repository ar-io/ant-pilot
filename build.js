/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');
const replace = require('replace-in-file');
const Ajv = require('ajv');
const standaloneCode = require('ajv/dist/standalone').default;
const contracts = ['contract.ts'];
const {
  balanceSchema,
  removeControllerSchema,
  setControllerSchema,
  setNameSchema,
  setTickerSchema,
  setRecordSchema,
  removeRecordSchema,
  transferSchema,
  evolveSchema,
} = require('./schemas');

// build our validation source code
const ajv = new Ajv({
  schemas: [
    balanceSchema,
    removeControllerSchema,
    setControllerSchema,
    setNameSchema,
    setTickerSchema,
    setRecordSchema,
    removeRecordSchema,
    transferSchema,
    evolveSchema,
  ],
  code: { source: true, esm: true },
});

const moduleCode = standaloneCode(ajv, {
  validateSetRecord: '#/definitions/setRecord',
  validateRemoveRecord: '#/definitions/removeRecord',
  validateSetController: '#/definitions/setController',
  validateRemoveController: '#/definitions/removeController',
  validateSetName: '#/definitions/setName',
  validateSetTicker: '#/definitions/setTicker',
  validateBalance: '#/definitions/balance',
  validateTransferTokens: '#/definitions/transfer',
  validateEvolve: '#/definitions/evolve',
});

// Now you can write the module code to file
fs.writeFileSync(path.join(__dirname, '/src/validations.js'), moduleCode);

build({
  entryPoints: contracts.map((source) => {
    return `./src/${source}`;
  }),
  outdir: './dist',
  minify: false,
  bundle: true,
  format: 'iife',
  packages: 'external',
  tsconfig: './tsconfig.json',
})
  .catch(() => process.exit(1))
  // note: SmartWeave SDK currently does not support files in IIFE bundle format, so we need to remove the "iife" part ;-)
  // update: it does since 0.4.31, but because viewblock.io is still incompatibile with this version, leaving as is for now.
  .finally(() => {
    const files = contracts.map((source) => {
      return `./dist${source}`.replace('.ts', '.js');
    });
    replace.sync({
      files: files,
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: '',
      countMatches: true,
    });
  });
