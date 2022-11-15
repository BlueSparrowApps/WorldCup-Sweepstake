# Introduction 
Web3 spin on World Cup Sweepstake.

# Development Environment Setup

  ## node package manager
  - In terminal (root of solution)
    - npm i
      - this will fetch all node_modules based on package.json
      
  ## truffle compile (smart contracts)
  - In terminal (root of solution)
    - truffle compile
      - this will generate the abis folder

  ## truffle test
  - Remember to TEST before/after changes
    - In terminal (root of solution)
      - truffle test
        - generates pass or failure from existing tests

# Verify Smart Contract Code on Etherscan
  - using npm package truffle-plugin-verify if not already installed (https://www.npmjs.com/package/truffle-plugin-verify)
  - referenced in truffle-config along with etherscan api key
  - Run in terminal for target network e.g.
    - truffle run verify WorldCupSweepstake --network goerli --debug

# Progressing the Tournament and paying owners of Winning NFT's
  - Set NETWORK in .env
  - Set NFT_CONTRACT_ADDRESS in .env  
  - Set OWNER_ADDRESS in .env  
  - Set TOURNAMENTSTAGE in .env  
  - Set PROGRESSINGTEAMIDS in .env
    - Take super extra CARE that this is correct
      because there is no going back.
    - Only send through Team Ids which are
      minted otherwise transaction will revert 
  - In Terminal
    - node src/scripts/progress.js
