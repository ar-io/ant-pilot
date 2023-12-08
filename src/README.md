## Table of Contents

1. **Getting Started**

   - **Prerequisites**
   - **Setting up the Development Environment**

2. **Project Structure**

3. **Specification File (SPEC.md)**

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

## Development

### Prerequisites

- [Yarn]

### Setting up the Development Environment

To set up your development environment, follow these steps:

1. Clone the ANT contracts repository:

```bash
git clone https://github.com/ar-io/ant-pilot.git
cd ant-pilot
```

2. Install project dependencies:

```bash
yarn install
```

# Additional Resources

### Documentation

- [Arweave Name System Documentation]
- [Permaweb Cookbook]

### Support channels & mentorship

- [Ar.IO Discord]
- [Arweave-Dev Discord]
- [Permaweb Discord]
- [Warp Discord]

[Yarn]: (https://yarnpkg.com/)
[Ar.IO Discord]: (https://discord.gg/7aQMHyY5FF)
[Arweave-Dev Discord]: (https://discord.gg/VEfJVuuUfx)
[Permaweb Discord]: (https://discord.gg/NPgK8vpQkw)
[Warp Discord]: (https://discord.gg/8EvRD38dk5)
[Arweave Name System Documentation]: (https://ar.io/docs/arns/)
[Permaweb Cookbook]: (https://cookbook.arweave.dev/concepts/arns.html)
