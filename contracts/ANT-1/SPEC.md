# ANT-1: Arweave Name Token

## Use Case

The ANT contract is designed for the Arweave Name System (ArNS), providing functionalities related to name token management. It allows users to manage records, transfer tokens, set and remove controllers, and evolve the contract. This contract is integral to enabling the functionality of the Arweave Name System (ArNS).

## Data Protocols

The contract has no required data protocols associated with it.

## Methods

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
