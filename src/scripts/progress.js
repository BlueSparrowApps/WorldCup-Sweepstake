const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const WorldCupSweepstake = require("../abis/WorldCupSweepstake.json");

require('dotenv').config()  // store environment variables from '.env' to process.env

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

const TOURNAMENTSTAGE = process.env.TOURNAMENTSTAGE;
const PROGRESSINGTEAMIDS = process.env.PROGRESSINGTEAMIDS;

console.log(`NETWORK ${NETWORK}`);
console.log(`OWNER_ADDRESS ${OWNER_ADDRESS}`);
console.log(`NFT_CONTRACT_ADDRESS ${NFT_CONTRACT_ADDRESS}`);


if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

async function main() {

  const goerliNodeUrl = isInfura
  ? "https://rinkeby.infura.io/v3/" + NODE_API_KEY
  : "https://eth-goerli.g.alchemy.com/v2/" + NODE_API_KEY;

  const mainnetNodeUrl = isInfura
  ? "https://mainnet.infura.io/v3/" + NODE_API_KEY
  : "https://eth-mainnet.alchemyapi.io/v2/" + NODE_API_KEY;
  
  let providerUrl = "";
  
  if(NETWORK == "mainet")
    providerUrl = mainnetNodeUrl;
else if(NETWORK == "goerli")
    providerUrl = goerliNodeUrl;
  else
    providerUrl = "http://127.0.0.1:7545";

  console.log(providerUrl);

  const provider = new HDWalletProvider(
    MNEMONIC,
    providerUrl
  );
  
  const web3Instance = new web3(provider, null);

  if (NFT_CONTRACT_ADDRESS) {
        
    const nftContract = await getContractFromAbi(web3Instance, "1000000");
    
    var currentStage = await nftContract.methods.tournamentStage().call();
    console.log(`current tournament stage: ${currentStage}`);
    
    // Progress tournament.
    console.log(`progress tournament to stage: ${TOURNAMENTSTAGE}`)
       
    try{
    
      var teamIdsArray = PROGRESSINGTEAMIDS.split(",");

      console.log(`teams progressing...`)
      teamIdsArray.forEach((item)=>console.log(item));

      if(currentStage >= TOURNAMENTSTAGE)
          throw "ERROR: Check tournament stage progressing to is greater than current stage"

      console.log("contract interaction");
      const result = await nftContract.methods
      .progressTournament(teamIdsArray, TOURNAMENTSTAGE)
      .send({ from: OWNER_ADDRESS});

      console.log('transaction sent');     
      
      currentStage = await nftContract.methods.tournamentStage().call();
      console.log(`current tournament stage: ${currentStage}`);

      if(currentStage != TOURNAMENTSTAGE)        
        console.log("FAILURE: Tournament stage not updated?");
      else
        console.log("SUCCESS: Tournament stage Progressed!");
        
    } catch (error) {
      console.error(error) // from creation or business logic
    }

  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS to the environment variables"
    );
  }
}

main();

async function getTotalSupply(nftContract) {
  console.log('totalSupply');
  const totalSupply = await nftContract.methods.totalSupply().call();
  console.log(totalSupply.toString());
}

//Provides access to the built abi and all public methods
async function getContractFromAbi(web3Instance, gasLimit) {
  
  const abi = WorldCupSweepstake.abi;

  const nftContractImported = new web3Instance.eth.Contract(
    abi,
    NFT_CONTRACT_ADDRESS,
    { gasLimit: gasLimit }
  );
  
  return nftContractImported;
  
}

