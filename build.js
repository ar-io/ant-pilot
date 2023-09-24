const fs = require("fs");
const path = require("path");
const { build } = require("esbuild");
const replace = require("replace-in-file");
const Ajv = require("ajv");
const standaloneCode = require("ajv/dist/standalone").default;
const contracts = ["/contracts/contract.ts"];
const {
  balanceSchema,
  removeControllersSchema,
  setControllersSchema,
  setNameSchema,
  setTickerSchema,
  setRecordSchema,
  removeRecordSchema,
  transferTokensSchema,
} = require("./schemas");

// build our validation source code
const ajv = new Ajv({
  schemas: [
    balanceSchema,
    removeControllersSchema,
    setControllersSchema,
    setNameSchema,
    setTickerSchema,
    setRecordSchema,
    removeRecordSchema,
    transferTokensSchema,
  ],
  code: { source: true, esm: true },
});

const moduleCode = standaloneCode(ajv, {
  validateSetRecord: "#/definitions/setRecord",
  validateRemoveRecord: "#/definitions/removeRecord",
  validateSetControllers: "#/definitions/setControllers",
  validateRemoveControllers: "#/definitions/removeControllers",
  validateSetName: "#/definitions/setName",
  validateSetTicker: "#/definitions/setTicker",
  validateBalance: "#/definitions/balance",
  validateTransferTokens: "#/definitions/transferTokens",
});

// Now you can write the module code to file
fs.writeFileSync(path.join(__dirname, "/src/validations.mjs"), moduleCode);

build({
  entryPoints: contracts.map((source) => {
    return `./src${source}`;
  }),
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "iife",
})
  .catch(() => process.exit(1))
  // note: SmartWeave SDK currently does not support files in IIFE bundle format, so we need to remove the "iife" part ;-)
  // update: it does since 0.4.31, but because viewblock.io is still incompatibile with this version, leaving as is for now.
  .finally(() => {
    const files = contracts.map((source) => {
      return `./dist${source}`.replace(".ts", ".js");
    });
    replace.sync({
      files: files,
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true,
    });
  });
