# Arweave Name Token (ANT) Contract Specification Contributor's Guide

Welcome to the Arweave Name Token (ANT) Contract Specification contributor's guide. This guide will help you understand how to contribute to the development and improvement of ANT contracts for the Arweave Name System. Your contributions play a vital role in enhancing the Arweave ecosystem.

## Table of Contents

1. **Getting Started**

   - **Prerequisites**
   - **Setting up the Development Environment**

2. **Project Structure**

3. **Contributing Guidelines**

   - **Creating a New Specification**
   - **Writing Tests**
   - **Integration and End-to-End Tests**
   - **Documentation**
   - **Pull Requests**

4. **Specification File (SPEC.md)**

## 1. Getting Started

### Prerequisites

Before you begin contributing to ANT contracts, make sure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

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

3. You are now ready to start contributing to ANT contracts.

## 2. Project Structure

ANT contracts follow a specific project structure. Ensure that your contribution adheres to this structure:

- `actions` directory: Contains `read` and `write` action files.
- `schemas` directory: Houses contract JSON schema definitions for state and methods.
- `utils` directory: Contains utility functions used in the contract.
- `tests` directory: All test files should be named with the pattern `*.test.ts`.
- `build` file: Script for building the contract.
- `constants` files: Constants and configuration for the contract.
- `SPEC.md` file: Outlines the use case, data protocols, and methods implemented by the contract, along with method arguments and their intended functions. If composing with other specifications, such as ANS-\* (Arweave Network Standards, e.g ANS-110), these should be listed in here as well.
- `state.json` file: Contains the initial state for the contract.
- `types` file: Type definitions for the contract.

## 3. Contributing Guidelines

### Creating a New Specification

1. Create a new directory for your specification in the contracts folder following the structure mentioned above. The naming convention for ANT contract specifications is ANT-`<spec number>`

2. Implement your contract logic in the `actions` and `utils` directories.

3. Write unit tests for all methods, both `read` and `write`, in the `tests` directory.

4. Create a `SPEC.md` file outlining the contract's use case, data protocols, and methods. Document method arguments and their intended functions.

## Test Coverage

Each method of the contract should have atleast one test suite with a test for the combination of arguments that exists for it. For example:

```javascript
function setRecord({subDomain, transactionId}) {
    ...
}
```

Would have tests targeting `subDomain` and `transactionId`, with happy and unhappy path scenarios on each.

### Writing Tests

Ensure that all methods, both `read` and `write`, have corresponding tests in the `tests` directory. Use a testing framework of your choice (e.g., Jest) to write these tests.

### Integration and End-to-End Tests

If your specification interacts with other contracts, such as trading or liquidity pool contracts, perform integration tests and end-to-end (E2E) tests using Arlocal to test the functions thoroughly.

### Documentation

Maintain clear and comprehensive documentation within the `SPEC.md` file. Provide usage examples, if applicable, to help other developers understand and use your contract.

### Pull Requests

When you are ready to contribute, follow these steps:

1. Fork the ANT contracts repository.

2. Create a feature branch for your contribution.

3. Commit your changes and push them to your forked repository.

4. Create a pull request (PR) to the main ANT contracts repository, explaining your changes and referencing the issue (if any) you're addressing.

5. Reviewers will assess your PR, and once approved, it will be merged into the main repository.

## 4. Specification File (SPEC.md)

Your `SPEC.md` file should contain detailed information about your ANT contract specification. Here's a template for what it might include:

### Use Case

Explain the use case of this contract. What is this specification intended for?

### Data Protocols

Describe the data protocols used by this contract.

### Methods

#### `methodName1(argument1: type, argument2: type)`

| Name      | Type | Pattern (if applicable) | Required (true/false) | Description              |
| --------- | ---- | ----------------------- | --------------------- | ------------------------ |
| argument1 | Type | Pattern (if applicable) | true/false            | Description of argument1 |
| argument2 | Type | Pattern (if applicable) | true/false            | Description of argument2 |

### Example Usage

Provide examples of how to use this contract, including a tool to interact with each method, e.g 'getBalance'. This is important to outline implementation of the specific contract.

### Integration with Other Contracts

Explain how this contract integrates with other contracts and provides links to relevant contracts.

# Additional Resources

### Documentation

- [Arweave Name System Documentation](https://ar.io/docs/arns/)
- [Permaweb Cookbook](https://cookbook.arweave.dev/concepts/arns.html)

### Support channels & mentorship

- [Ar.IO Discord](https://discord.gg/7aQMHyY5FF)
- [Arweave-Dev Discord](https://discord.gg/VEfJVuuUfx)
- [Permaweb Discord](https://discord.gg/NPgK8vpQkw)
- [Warp Discord](https://discord.gg/8EvRD38dk5)
