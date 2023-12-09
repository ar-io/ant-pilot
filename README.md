
# Arweave Name Token Proof of Concept

### Methods

### Initial setup

```typescript
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

const warp = WarpFactory.forMainnet(
  {
    ...defaultCacheOptions,
    inMemory: true,
  },
  true,
);
const wallet: JWKInterface = JSON.parse(
  await fs.readFileSync('./my-keyfile.json').toString(),
);
const walletAddress = await arweave.wallets.jwkToAddress(wallet);
const ANT_CONTRACT_TXID = '000000000000000000000000000000000000000000'; // your contract id here
const contract = warp.contract(ANT_CONTRACT_TXID).connect<any>(wallet);
```

### `transfer`

Transfers the ownership of the ANT.

| Name   | Type   | Pattern               | Required | Description                 |
| ------ | ------ | --------------------- | -------- | --------------------------- |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address to transfer ANT to. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function:"transfer"
  target: '000000000000000000000000000000000000000000', // the recipient of the ANT contract
  qty: 1,
});
```

### `setRecord`

Sets a record for a given subdomain.

| Name          | Type   | Pattern                   | Required | Description                         |
| ------------- | ------ | ------------------------- | -------- | ----------------------------------- |
| subDomain     | string | "^(?:[a-zA-Z0-9_-]+\|@)$" | true     | Subdomain to set the record for.    |
| transactionId | string | "^[a-zA-Z0-9_-]{43}$"     | true     | Transaction ID for the record.      |
| ttlSeconds    | number | Min: 900, Max: 2,592,000  | false    | Time-to-live in seconds for record. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function:"setRecord",
  subDomain: "my-undername"
  transactionId: '000000000000000000000000000000000000000000', // the recipient of the ANT contract
  ttlSeconds: 900,
});
```

### `setName`

Sets the name of the ANT.

| Name | Type   | Pattern | Required | Description           |
| ---- | ------ | ------- | -------- | --------------------- |
| name | string | N/A     | true     | New name for the ANT. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'setName',
  name: 'my-name',
});
```

### `setTicker`

Sets the ticker symbol for the ANT.

| Name   | Type   | Pattern | Required | Description                |
| ------ | ------ | ------- | -------- | -------------------------- |
| ticker | string | N/A     | true     | New ticker symbol for ANT. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'setTicker',
  ticker: 'my-ticker',
});
```

### `setController`

Adds a new controller to the ANT.

| Name   | Type   | Pattern               | Required | Description                    |
| ------ | ------ | --------------------- | -------- | ------------------------------ |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address of the new controller. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'setController',
  target: '000000000000000000000000000000000000000000', // the controller to add
});
```

### `removeController`

Removes a controller from the ANT.

| Name   | Type   | Pattern               | Required | Description                          |
| ------ | ------ | --------------------- | -------- | ------------------------------------ |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address of the controller to remove. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'removeController',
  target: '000000000000000000000000000000000000000000', // the controller to remove
});
```

### `removeRecord`

Removes a record from the ANT.

| Name      | Type   | Pattern                   | Required | Description                        |
| --------- | ------ | ------------------------- | -------- | ---------------------------------- |
| subDomain | string | "^(?:[a-zA-Z0-9_-]+\|@)$" | true     | Subdomain of the record to remove. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'removeRecord',
  subDomain: 'my-subdomain', // the subdomain to remove
});
```

### `balance`

Retrieves the balance of a target address.

| Name   | Type   | Pattern               | Required | Description                      |
| ------ | ------ | --------------------- | -------- | -------------------------------- |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address to retrieve balance for. |

```typescript
const { originalTxId } = await contract.viewState({
  function: 'balance',
  target: '000000000000000000000000000000000000000000', // the address to view the balance of
});
```

### `evolve`

Allows the contract to evolve by setting a new contract source.

| Name  | Type   | Pattern               | Required | Description                       |
| ----- | ------ | --------------------- | -------- | --------------------------------- |
| value | string | "^[a-zA-Z0-9_-]{43}$" | true     | New source code for the contract. |

```typescript
const { originalTxId } = await contract.writeInteraction({
  function: 'evolve',
  value: '000000000000000000000000000000000000000000', // the source code transaction to use
});
```

# Development
## Project setup

Clone this repository and install the dependencies.

```bash
git clone https://github.com/ar-io/ant-pilot.git
cd ant-pilot
```


```
yarn install
```

### Compiles and minifies for production

```
yarn build
```

### Tests contracts with arlocal

```
yarn test
```

#### Usage of AJV in Contract Methods

In our contract methods, we import the relevant validation function from `validations.js` and use it to validate the input data. For example, if we have a contract method `setRecord`, we use the `validateSetRecord` function to validate its inputs.

```javascript
const { validateSetRecord } = require('./validations');

function setRecord(input) {
  if (!validateSetRecord(input)) {
    throw new Error('Invalid input');
  }
}
```

# Additional Resources
Check out the Arweave Name System on the [ArNS Portal]!

### Documentation

- [Arweave Name System Documentation]
- [Permaweb Cookbook]
- [AJV]
- [ArNS Service]

### Support channels

- [Ar.IO Discord]
- [Arweave-Dev Discord]
- [Permaweb Discord]
- [Warp Discord]


### Tools

In order to deploy contracts and use the Arweave Name System (along with creating Arweave Name Tokens) the following tools are available to be used.

Make sure to update the variables at the top of each tool's `.ts` file, as well as the local wallet file in `constants.ts`


- `deploy-contract` creates a new ANT with arweave data pointer. Requires a short token ticker, a friendly token name and an Arweave Transaction ID as the data pointer. The state variables can be updated in `inital-state.json` in the root folder of the project.
- `remove-ant-subdomain` removes an existing subdomain from the ANT. Requires the subdomain name to be removed and the ANT Smartweave Contract ID.
- `transfer-ant` transfers a ANT to another wallet. Requires the recipient target to transfer the ANT to, and the ANT Smartweave Contract ID that is to be transfered.
- `update-ant-subdomain` creates a new subdomain in a ANT or updates existing one. Requires the subdomain name that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction. Please note that only the `@` sub domain will work at this time.


The above scripts must have their variables updated in the script, and can be run like the following example
`yarn ts-node .\tools\deploy-contract.ts`

[Yarn]: (https://yarnpkg.com/)
[Ar.IO Discord]: (https://discord.gg/7aQMHyY5FF)
[Arweave-Dev Discord]: (https://discord.gg/VEfJVuuUfx)
[Permaweb Discord]: (https://discord.gg/NPgK8vpQkw)
[Warp Discord]: (https://discord.gg/8EvRD38dk5)
[Arweave Name System Documentation]: (https://ar.io/docs/arns/)
[Permaweb Cookbook]: (https://cookbook.arweave.dev/concepts/arns.html)
[AJV]:(https://ajv.js.org/guide/getting-started.html)
[ArNS Portal]:(https://arns.app)
[ArNS Service]:(https://github.com/ar-io/arns-service)



