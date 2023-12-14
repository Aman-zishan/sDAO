# sDAO

milestone based funded decentralized grants program

features:

- Smart contract automated fund claim process
- Proper ownership access control
- Supports multiple milestones
- Claiming flow is a proposal and proof of work can be submitted as a smart contract
- Easy to use UI for deployer and members to setup DAO
- Write and deploy within the app
- Clarity syntax highlight 

# short video demo (7 mins)

link: https://youtu.be/aDuB2fzSNM8

<img width="1440" alt="Screenshot 2023-12-14 at 5 34 15 AM" src="https://github.com/Aman-zishan/sDAO/assets/55238388/649be4be-768b-4299-b96e-bacbc1307def">

## Getting Started

To get the application running, follow these steps:

1. Clone the repository: `git clone [git@github.com:Aman-zishan/sDAO.git](https://github.com/Aman-zishan/sDAO.git)`
2. Navigate into the directory: `cd sDAO`
3. Install the dependencies: `yarn install`
4. Start the development server: `yarn dev`

## Setup

Before getting into testing the application you need to spin up the devnet. This applications uses devnet to interact with the smart contract. To spin up the devnet, follow these steps:

In a new terminal session run the command:

1. `clarinet integrate`
2. Once the devnet is up and running, import wallets to different browser accounts
3. Import deployer wallet, go to `settings/Devnet.toml` and copy the mnemonic of the deployer account
5. Similarly import the mnemonic of any other wallet to be the member of DAO make sure the account you import has membership token balance



## Demo

<img width="1440" alt="Screenshot 2023-12-14 at 5 34 26 AM" src="https://github.com/Aman-zishan/sDAO/assets/55238388/94346b94-2aec-4dad-9dee-66012ce0f24e">


1. Connect the deployer wallet to the application

2. Go to `Bootstrap DAO` page and click on each step to bootstrap sDAO one by one (user should be deployer for this action)
   
5. Once the bootstrap is completed you can deploy and propose grant via `new grant proposal` page

6. After proposing new grant find the grant under `your proposals` , vote and conclude. You can also connect via another wallet and vote for the grant

7. click on `conclude` to conclude and execute the proposal

8. once succcesfull go ahead and repeat the process for claiming the milestone, make sure to change the `contract` in boilerplate `.grant-proposal` to your newly deployed grant contract

9. vote and conclude just like grant proposal

10. You should be able to see the stx transfer event from the contract wallet to the provided recipient
   
