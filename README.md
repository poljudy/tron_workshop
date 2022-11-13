# HotSkills (formerly MeDo) - Blockchain Freelance Platform
HotSkills is a prototype of a freelancing platform which stores it's data on blockchain.

Application deployed at [https://hotskills.netlify.app/](https://hotskills.netlify.app/), currently running on TRON Nile testnet.
Smart Contract deployed at address TG2XQuSvCW1BJbKd4s8bxAvATHFmQHbU4Y.

## Introduction
The idea of HotSkills was inspired by Verified Market Research, which says the freelance market size was valued at USD 3.8 billion in 2020. Growing at a CAGR of 15.02%, it is expected to grow to over USD 12 billion by 2028. I decided to promote mass adoption by attracting freelancers to the crypto industry. To attract freelancers into crypto I’m going to create the best crypto freelancing platform guaranteeing payments by smart contracts, providing security and an integrated payment system that can decrease delays and minimize fees in cases of international payments and its decentralized nature mean there is no middleman.

## What it does
The platform allows users to earn crypto by executing paid tasks added by others or by promoting their own services. Two types of tasks are currently available: First Come First Serve - the first user who applied will be set as an assignee, Selected by Author - the task author can select an executor from the candidate list e.g. by their ratings or based on their profile info. Third task type such as escrow contract - TBD. The task author can request changes if they are unsatisfied with the result or open a dispute for third-party result verification - TBD.
Users can create their profiles to provide more info for customers.
Users can add, pause/resume, or delete their services. Others can request that services.

## Install
1. Run `npm install` at the root of your directory
2. Run `yarn` at the client directory to install the client dependencies

## Prepare the client
1. Replace the cotract address in the utils/constants.js with the new deployed one
2. Replace conractABI.json with the contract abi json

## Run client
Run `yarn dev` at the client directory to run the client locally


