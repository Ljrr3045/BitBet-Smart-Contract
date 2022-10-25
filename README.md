# BitBet

BitBet is a web3 project which is based on carrying out a totally decentralized lottery, which does not have any manipulation in the results. BitBet is characterized from other web3 projects in the sector, because it seeks to increase the final prize obtained by the winner, therefore the idea is that the user who manages to hit the winning number will receive the total of the funds that were collected in the period. of the lottery, in case there is no winner these funds will continue to accumulate for the next draw.

# BitBet - Smart Contract

In this repository you will find each of the smart contracts used to give life to the BitBet Dapp, these are developed through solidity and the hardhat framework was used for the structure of the project.

# Getting started

## Folder structure

    - contracts (Contracts and interfaces used)
        - invest money (It contains everything related to handling and interaction with C.R.E.A.M. Finance)
        - Mock (Contains the VRF Coordinator contract used for testing)
        - random number (Contains everything related to obtaining and interacting with random numbers using ChainLink)
    - docs (Contract documentation)
    - scripts (Script for contract deployment)
    - test (Contract testing)
        - invest money test (Test related to the money investment section)
        - random number test (Test related to the random numbers section)

## Technologies and protocols used

This repository uses the following technologies and protocols:
* [Solidity](https://docs.soliditylang.org/en/v0.8.17/)
* [Hardhat](https://hardhat.org/docs)
* [OpenZeppelin](https://docs.openzeppelin.com/)
* [C.R.E.A.M. Finance](https://docs.cream.finance/)
* [ChainLink VRF](https://docs.chain.link/docs/intermediates-tutorial/)
* [BSC](https://bscscan.com/)

## Clone the repo

The first step is to clone this repository:
```
# Get the latest version of the project
git clone https://github.com/Ljrr3045/BitBet-Smart-Contract.git

# Change to home directory
cd BitBet-Smart-Contract
```

To install all package dependencies run:
```
# Install all dependencies
npm i
```

## Useful commands

```
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run some deploy script
npx hardhat run --network <NETWORK_NAME> scripts/<FILE NAME>.js

# Check contract in scanner
npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>

# Generate documentation
npx hardhat docgen
```

## Notes

1. For the reason that some functions of the contracts are of "internal" state, some tests have been omitted, to execute and check these you must do the following:

    - Change the state from "internal" to public for the features you want to test.
    - Go to the test file and set it to be taken into account in the tests

        xdescribe("InvestMoney", async ()=> { ... --> describe("InvestMoney", async ()=> { ...
