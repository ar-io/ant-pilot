# Gateway Name Token Proof of Concept

## Project setup
```
yarn add arweave@1.10.23 arlocal@1.1.30 redstone-smartweave@0.5.6
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
In order to deploy contracts and use the Gateway Name Service Registry (along with creating Gateway Name Tokens) the following tools are available to be used. 

Make sure to update the variables at the top of each tool's `.ts` file, as well as the local wallet file in `constants.ts`  

- `buy-record` purchases a new ArNS Name in the registry (if availabile) and adds the reference to the ANT Smartweave Contract ID.  Requires the name you wish to purchase, the ANT Smartweave Contract ID that will be added to the registry, and the ArNS Registry Smartcontract ID.
- `create-ant` creates a new ANT with arweave data pointer.  Requires a short token ticker, a friendly token name and an Arweave Transaction ID as the data pointer.  Please note that only the `@` sub domain will work at this time, and it is hard-coded into the script.
- `create-ant-and-buy-record` creates a new ANT with arweave data pointer and then registers it in the ArNS Registry.   Please note that only the `@` sub domain will work at this time, and it is hard-coded into the script.  Also this script will not check if the ANT was successfully created and mined before adding to the ArNS Registry.
- `create-test-ant` creates a new ANT with arweave data pointer on RedStone Testnet.  Requires a short token ticker, a friendly token name and an Arweave Transaction ID as the data pointer.
- `deploy-contract` deploys a new ANT Source Contract to mainnet  
- `deploy-test-contract` deploys a new Test ANT Source Contract to Redstone Testnet  
- `remove-record` removes an existing record from the ANT.  Requires the subDomain to be removed and the ANT Smartweave Contract ID.
- `remove-test-record` removes an existing record from a Test ANT on Redstone Testnet.  Requires the subDomain to be removed and the ANT Smartweave Contract ID.
- `transfer-ant` transfers a ANT to another wallet.  Requires the recipient target to transfer the ANT to, and the ANT Smartweave Contract ID that is to be transfered.
- `transfer-test-ant` transfers a Test ANT to another wallet on Redstone Testnet.  Requires the recipient target to transfer the Test ANT to, and the ANT Smartweave Contract ID that is to be transfered.
- `update-record` creates a new record in a ANT or updates existing one.  Requires the sub domain that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction.  Please note that only the `@` sub domain will work at this time.
- `update-test-record` creates a new record in a ANT or updates existing one on Redstone Testnet.  Requires the sub domain that is to be created or updated, the ANT Smartweave Contract ID and an Arweave Transaction.  Please note that only the `@` sub domain will work at this time.

The above scripts can be run like the following example
`yarn ts-node .\src\tools\create-ant-and-buy-record.ts`


