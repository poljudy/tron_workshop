# MeDo - Blockchain Freelance Platform
MeDo is a prototype of a freelancing platform which stores it's data on blockchain.

Application deployed on GitHub Pages at [https://vadkutsen.github.io/medo](https://vadkutsen.github.io/medo), currently running on Mumbai Test network.
Smart Contract deployed at address 0xB8f579Bed6dc8BB35B0B02515F082b7C5dF8862F.

## Introduction
Idea of MeDo is to ease the difficulties faced by freelancers now-a-days such as unsurity about payment and high fees charged by middlemen. Blockchain can help by guaranteeing payments with help of smart contracts, providing security and an integrated payment system which can save time delays and fees in cases of international payments and its decentralised nature means there is no middleman.

## Install
1. Run `npm install` at the root of your directory
2. Run `yarn` at the client directory to install the client dependencies

## Test
Run `npx hardhat test` at the smart_contract directory to run smart contract tests

## Deploy contract
Run `npx hardhat run scripts/deploy.js --network matic` at the smart_contract directory to deploy the smart contract

## Prepare the client
1. Replace the cotract address in the utils/constants.js with the new deployed one
2. Replace conractABI.json with the contract json from smart_contract/artifacts/contracts/{your_contract}/{your_contract}.json

## Run client
Run `yarn dev` at the client directory to run the client locally


