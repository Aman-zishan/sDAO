# README

This repository contains a starter package for the Hiro Hacks series.

## Getting Started

To get the application running, follow these steps:

1. Clone the repository: `git clone https://github.com/hirosystems/hiro-hacks-template.git`
2. Navigate into the directory: `cd hiro-hacks-template`
3. Install the dependencies: `yarn install`
4. Start the development server: `yarn dev`

### fund the core contract with 1M STX

(stx-transfer? u1000000000000 tx-sender .core)

### bootstrap core contract

(contract-call? .core construct .bootstrap)

### propose milestone extension
(contract-call? .proposal-submission propose .milestone-extension-proposal "extension for milestone based funding" u"same as title")

### vote for milestone proposal
(contract-call? .proposal-voting vote u100 true .milestone-extension-proposal)

### advance chain tip by proposal time
::advance_chain_tip 1440

### conclude proposal
(contract-call? .proposal-voting conclude .milestone-extension-proposal)

### propose grant
(contract-call? .proposal-submission propose .grant-proposal "test grant proposal" u"same as title")

### vote for grant proposal
(contract-call? .proposal-voting vote u100 true .grant-proposal)

::advance_chain_tip 1440

### conclude grant proposal
(contract-call? .proposal-voting conclude .grant-proposal)