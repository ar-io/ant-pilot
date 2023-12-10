
# ArNS - Arweave Name Token (ANT)

This repository contains the source code used for Arweave Name Tokens used to resolve ArNS names on ar-io gateways. For official documentation on ANT's refer to the [ArNS ANT Docs]. For official documentation on ArNS refer to the [ArNS Docs].

## Overview

The ANT [SmartWeave] Contract is a standardized contract that contains the specific ArNS Record specification required by [AR.IO gateways] who resolve ArNS names and their Arweave Transaction IDs. It also contains other basic functionality to establish ownership and the ability to transfer ownership and update the Arweave Transaction ID.

## ANT Contract

ANT contracts need to include the following methods and match the general schema of the [ANT Contract Schema] to be usable for ArNS name resolutions. 

### Methods




### `transfer`

Transfers the ownership of the ANT.

| Name   | Type   | Pattern               | Required | Description                 |
| ------ | ------ | --------------------- | -------- | --------------------------- |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address to transfer ANT to. |


### `setRecord`

Sets a record for a given subdomain.

| Name          | Type   | Pattern                   | Required | Description                         |
| ------------- | ------ | ------------------------- | -------- | ----------------------------------- |
| subDomain     | string | "^(?:[a-zA-Z0-9_-]+\|@)$" | true     | Subdomain to set the record for.    |
| transactionId | string | "^[a-zA-Z0-9_-]{43}$"     | true     | Transaction ID for the record.      |
| ttlSeconds    | number | Min: 900, Max: 2,592,000  | false    | Time-to-live in seconds for record. |


### `setName`

Sets the name of the ANT.

| Name | Type   | Pattern | Required | Description           |
| ---- | ------ | ------- | -------- | --------------------- |
| name | string | N/A     | true     | New name for the ANT. |


### `setTicker`

Sets the ticker symbol for the ANT.

| Name   | Type   | Pattern | Required | Description                |
| ------ | ------ | ------- | -------- | -------------------------- |
| ticker | string | N/A     | true     | New ticker symbol for ANT. |


### `setController`

Adds a new controller to the ANT.

| Name   | Type   | Pattern               | Required | Description                    |
| ------ | ------ | --------------------- | -------- | ------------------------------ |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address of the new controller. |

### `removeController`

Removes a controller from the ANT.

| Name   | Type   | Pattern               | Required | Description                          |
| ------ | ------ | --------------------- | -------- | ------------------------------------ |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address of the controller to remove. |

### `removeRecord`

Removes a record from the ANT.

| Name      | Type   | Pattern                   | Required | Description                        |
| --------- | ------ | ------------------------- | -------- | ---------------------------------- |
| subDomain | string | "^(?:[a-zA-Z0-9_-]+\|@)$" | true     | Subdomain of the record to remove. |

### `balance`

Retrieves the balance of a target address.

| Name   | Type   | Pattern               | Required | Description                      |
| ------ | ------ | --------------------- | -------- | -------------------------------- |
| target | string | "^[a-zA-Z0-9_-]{43}$" | true     | Address to retrieve balance for. |

### `evolve`

Allows the contract to evolve by setting a new contract source.

| Name  | Type   | Pattern               | Required | Description                       |
| ----- | ------ | --------------------- | -------- | --------------------------------- |
| value | string | "^[a-zA-Z0-9_-]{43}$" | true     | New source code for the contract. |

# Development

## Project setup

Clone this repository and install the dependencies.

```bash
git clone https://github.com/ar-io/ant-pilot.git
cd ant-pilot
```

```typescript
yarn install
yarn build
yarn test
```

#### AJV

The Arweave Name Token contract uses [AJV] for validating the input data for interactions. The schemas for each is located in [schemas] directory.

### Tools

In order to deploy contracts and use the Arweave Name System (along with creating Arweave Name Tokens) the following tools are available to be used.

Make sure to update the variables at the top of each tool's `.ts` file, as well as the local wallet file in `constants.ts`

- `yarn ts-node tools/deploy-contract.ts` creates a new ANT with arweave data pointer. Requires a short token ticker, a friendly token name and an Arweave Transaction ID as the data pointer. The state variables can be updated in `inital-state.json` in the root folder of the project.
- `yarn ts-node tools/remove-ant-subdomain` removes an existing subdomain from the ANT. Requires the subdomain name to be removed and the ANT Smartweave Contract ID.
- `yarn ts-node tools/transfer-ant` transfers a ANT to another wallet. Requires the recipient target to transfer the ANT to, and the ANT Smartweave Contract ID that is to be transfered.
- `update-ant-subdomain` creates a new subdomain in a ANT or updates existing one. Requires the subdomain name that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction. Please note that only the `@` sub domain will work at this time.
- `yarn ts-node tools/set-record` - sets a record for a given subdomain. Requires the subdomain name that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction. Please note that only the `@` sub domain will work at this time.

# Additional Resources

- [AR.IO Gateways]
- [ArNS Docs]
- [ArNS Portal]
- [ArNS Service]
- [Permaweb Cookbook]
- [Warp]

[ANT Contract Schema]:./initial-state.json
[AR.IO Gateways]:https://ar.io/docs/gateway-network/#overview
[ArNS Docs]:https://ar.io/docs/arns/
[ArNS ANT Docs]:https://ar.io/docs/arns/#arweave-name-token-ant
[ArNS Service]:https://github.com/ar-io/arns-service
[ArNS Portal]:https://arns.app
[Permaweb Cookbook]:https://cookbook.arweave.dev/concepts/arns.html
[AJV]:https://ajv.js.org/guide/getting-started.html
[Warp]:https://academy.warp.cc
[SmartWeave]:https://github.com/ArweaveTeam/SmartWeave

