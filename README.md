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

- `buy-record` purchases a new ArNS Name in the registry (if availabile) and adds the reference to the ANT Smartweave Address  
- `create-ant` creates a new ANT with arweave data pointer
- `create-ant-and-buy-record` creates a new ANT with arweave data pointer and then registers it in the ArNS Registry
- `create-test-ant` creates a new ANT with arweave data pointer on RedStone Testnet
- `deploy-contract` deploys a new ANT Contract to mainnet  
- `deploy-test-contract` deploys a new ANT Contract to Redstone Testnet  
- `remove-record` removes an existing record from the ANT
- `remove-test-record` removes an existing record from a ANT on Redstone Testnet
- `transfer-ant` transfers a ANT to another wallet  
- `transfer-test-ant` transfers a ANT to another wallet on Redstone Testnet
- `update-record` creates a new record in a ANT or updates existing one
- `update-test-record` creates a new record in a ANT or updates existing one on Redstone Testnet

The above scripts can be run like the following example
`yarn ts-node .\src\tools\create-ant-and-buy-record.ts`


