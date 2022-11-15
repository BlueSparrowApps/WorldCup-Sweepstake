/* Taken and adapted for goerli network from https://github.com/ProjectOpenSea/opensea-creatures/blob/f7257a043e82fae8251eec2bdde37a44fee474c4/truffle.js */
const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()  // store environment variables from '.env' to process.env

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const ETHERSCANAPI = process.env.ETHERSCANAPI;

console.log(`MNEMONIC ${MNEMONIC}`)
console.log(`NODE_API_KEY ${NODE_API_KEY}`)
console.log(`isInfura ${isInfura}`)

//TODO: This doesn't currently work, why?
const needsNodeAPI =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("goerli") ||
    process.env.npm_config_argv.includes("live"));

console.log(`needsNodeAPI ${needsNodeAPI}`)

if ((!MNEMONIC || !NODE_API_KEY) && needsNodeAPI) {
  console.error("Please set a mnemonic and ALCHEMY_KEY or INFURA_KEY.");
  process.exit(0);
}

const goerliNodeUrl = isInfura
  ? "https://rinkeby.infura.io/v3/" + NODE_API_KEY
  : "https://eth-goerli.g.alchemy.com/v2/" + NODE_API_KEY;
//console.log(`goerliNodeUrl ${goerliNodeUrl}`)

const mainnetNodeUrl = isInfura
  ? "https://mainnet.infura.io/v3/" + NODE_API_KEY
  : "https://eth-mainnet.g.alchemy.com/v2/" + NODE_API_KEY;
//console.log(`mainnetNodeUrl ${mainnetNodeUrl}`)


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      //gas: 5000000
           //  6721975 from web3.eth.getBlock('latest')
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, goerliNodeUrl);
      },
      //https://trufflesuite.com/docs/truffle/reference/configuration/
      gas: 5000000, //gas unit limit
      //  note... testnet gas fees may be higher than neccessary for mainnet
      gasPrice: 50000000000,  //gas price (see documentation for defaults)
      network_id: 5,      
    },
    live: {
      network_id: 1,
      provider: function () {
        return new HDWalletProvider(MNEMONIC, mainnetNodeUrl);
      },
      //https://trufflesuite.com/docs/truffle/reference/configuration/
      //If unsure try using --dry-run
      gas: 4343802, //gas unit limit
      //Gas price used for deploys. Default is 20000000000 (20 Gwei)
      gasPrice: 20000000000,  //gas price (see documentation for defaults)
                
    },
  },

  contracts_directory: './src/contracts/',

  contracts_build_directory: './src/abis',

  compilers: {
    solc: {
      version:'0.8.17',
      settings: {
        //According to link below, each compiler version has a default evmversion
        //so why deviate?
        //  https://docs.openzeppelin.com/cli/2.8/compiling#picking_an_evm_version
        //evmVersion: 'byzantium', // Default: "petersburg"
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  
  //Used to verify contract code on etherscan, to prove what code is actually running on the blockchain!
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    //api key to verify with etherscan
    etherscan: ETHERSCANAPI
  }
};
