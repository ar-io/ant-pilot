# Arweave Name Token Proof of Concept

## Project setup

Clone this repository and install the dependencies.

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


### Tools

In order to deploy contracts and use the Arweave Name System (along with creating Arweave Name Tokens) the following tools are available to be used.

Make sure to update the variables at the top of each tool's `.ts` file, as well as the local wallet file in `constants.ts`


- `deploy-contract` creates a new ANT with arweave data pointer. Requires a short token ticker, a friendly token name and an Arweave Transaction ID as the data pointer. The state variables can be updated in `inital-state.json` in the root folder of the project.
- `remove-ant-subdomain` removes an existing subdomain from the ANT. Requires the subdomain name to be removed and the ANT Smartweave Contract ID.
- `transfer-ant` transfers a ANT to another wallet. Requires the recipient target to transfer the ANT to, and the ANT Smartweave Contract ID that is to be transfered.
- `update-ant-subdomain` creates a new subdomain in a ANT or updates existing one. Requires the subdomain name that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction. Please note that only the `@` sub domain will work at this time.


The above scripts must have their variables updated in the script, and can be run like the following example
`yarn ts-node .\tools\deploy-contract.ts`


