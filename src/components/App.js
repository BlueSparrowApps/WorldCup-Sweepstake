import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import WorldCupSweepstakeContract from '../abis/WorldCupSweepstake.json';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as ArrowRight } from '../resources/ArrowRight.svg';
import { ReactComponent as WorldCupSweepStakeImg } from '../resources/WorldCupSweepStake.svg';
import './App.css';
import Header from './Header';
import GradientButton from './GradientButton';
import CountryEmoji from './CountryEmoji';

const App = () => {
    const [account, setAccount] = useState('');
    const [accountClaimable, setAccountClaimable] = useState(0);
    const [contract, setContract] = useState(null);
    const [contractBalance, setContractBalance] = useState('0');
    const [totalSupply, setTotalSupply] = useState(0);
    const [myNftInfos, setMyNftInfos] = useState([]);
    const [hasMyNftInfo, setHasMyNftInfos] = useState(false);
    const [teamLimitReached, setTeamLimitReached] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        const setupContract = async () => {
            try {
                setIsBusy(true);
                await loadWeb3();
                await loadBlockchainData();
            } catch (e) {
                console.error(e);
            } finally {
                setIsBusy(false);
            }
        }
        setupContract();
    }, []);

    const buyandmint = async () => {
        try {
            setIsBusy(true);
            const totalSupply = await contract.methods.totalSupply().call();
            setTotalSupply(totalSupply);

            if (totalSupply < 32) {
                const nftInitialPrice = 0.012 * 1e18; //ETH
                await contract.methods.buyNextTeam(nftInitialPrice.toString(), account).send({ from: account, value: nftInitialPrice.toString() });
                await loadMyNFTs(contract, account);

                if (totalSupply === 31) {
                    setTeamLimitReached(true);
                }
            } else {
                setTeamLimitReached(true);
                alert('no teams remaining');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsBusy(false);
        }
    }

    const claim = () => {
        try {
            setIsBusy(true);
            contract.methods.withdrawPayments(account)
                .send(
                    {                        
                        from: account
                    }
                )
        } catch (e) {
            console.error(e);
        } finally {
            setIsBusy(false);
        }
    }

    const loadWeb3 = async () => {
        const provider = await detectEthereumProvider();
        const options = {
            transactionConfirmationBlocks: 1
        };

        if (provider) {
            console.log('wallet connected');
            window.web3 = new Web3(provider, options);
            await window.ethereum.enable();
            //window.ethereum = provider;
        }
        else {
            // no provider
            console.log('no wallet detected');
        }

    }

    const loadBlockchainData = async () => {

        const web3 = window.web3;
        if (web3) {

            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkid = await web3.eth.net.getId();
            console.log(`networkid ${networkid}`);
            const networkData = WorldCupSweepstakeContract.networks[networkid];
            console.log(`networkData ${networkData}`);

            if (networkData) {
                const abi = WorldCupSweepstakeContract.abi;
                const address = networkData.address;
                const contract = new web3.eth.Contract(abi, address);
                setContract(contract);

                const totalSupply = await contract.methods.totalSupply().call();
                setTotalSupply(totalSupply);
                console.log(`totalSupply ${totalSupply}`);

                /* Connected User stuff */

                var accountClaimable = await contract.methods.payments(accounts[0]).call();
                accountClaimable = (accountClaimable / 1e18).toFixed(5);
                if (accountClaimable != null) {
                    const accountClaimableString = accountClaimable.toString();
                    setAccountClaimable(accountClaimableString);
                }

                /*  END connected user stuff */


                var balance = await contract.methods.getContractBalance().call();
                //contractBalance = contractBalance / 10e18; //Convert Gwei to Eth
                if (balance != null) {
                    // convert wei to eth
                    balance = (balance / 1e18).toFixed(5);
                    const contractBalanceString = balance.toString();
                    setContractBalance(contractBalanceString);
                }

                await loadMyNFTs(contract, accounts[0]);


            } else {
                window.alert('smart contract not deployed');
            }
        }

    }

    const loadMyNFTs = async (contract, account) => {
        const web3 = window.web3;
        if (web3) {

            const totalSupply = await contract.methods.totalSupply().call();
            setTotalSupply(totalSupply);

            if (totalSupply === 32) {
                setTeamLimitReached(true);
            }

            const balance = await contract.methods.balanceOf(account).call();
            const tournamentStage = await contract.methods.tournamentStage().call();

            let myNfts = [];

            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
                const team = await contract.methods.teamFromTokenId(tokenId).call();

                let metadatauri = await contract.methods.tokenURI(tokenId).call();

                let nftMetadataJson = null;
                try {

                    let nftMetadata = await fetch(metadatauri);
                    nftMetadataJson = await nftMetadata.json();
                } catch (e) {
                    console.log(`errror fetching meta daat ${e}`);
                }

                let mynftinfo = {}
                if (nftMetadataJson != null) {
                    mynftinfo = {
                        name: nftMetadataJson.name,
                        description: nftMetadataJson.description,
                        image: nftMetadataJson.image,
                        inTournament: team.stage >= tournamentStage,
                    };
                }
                else {
                    //Meta data error
                    mynftinfo = {
                        name: team.teamId,
                        description: 'Metadata load failure',
                        inTournament: team.stage >= tournamentStage,
                    };
                }

                myNfts.push(mynftinfo);
            }

            console.log(myNfts);

            setMyNftInfos(myNfts);
            setHasMyNftInfos(myNfts.length > 0);
        }
    }

    return (
        <Router>
            <Routes>
                <Route
                    path='/'
                    element={
                        <div className='Body h-screen w-full flex flex-col'>
                            {/* All Content within this Div */}
                            <div className='Header w-full h-fit flex justify-between items-center'>
                                {/* HEADER Container */}
                                <div className='ContractBalanceContainer flex flex-col ml-4 p-2'>
                                    {/* <small className='font-inter text-xs sm:text-sm'>SWEEPSTAKE POT</small>
                                    <big className='font-inter text-lg sm:text-xl font-bold'>{contractBalance} ETH</big> */}
                                </div>

                                <div className='TopRightBtnContainer'>
                                    {/* TODO: replace with your organisation url (see Header.js) */}
                                    <Header linkText='Learn More' secondBtnText='Buy team (ETH 0.012)' secondBtnDisabled={teamLimitReached} secondBtnOnClick={(event) => {
                                        event.preventDefault()
                                        buyandmint()
                                    }} />
                                    {isBusy &&
                                        <div className='SpinnerWrapper '>
                                            <Spinner className='h-10 w-10' animation="border" role="status" />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='Outerwrapper w-full flex grow'>
                                {/* Outer Wrapper */} 
                                <div className='Innerwrapper w-full flex flex-col justify-center items-center md:flex-row py-10'>
                                    {/* Inner Wrapper */}
                                    <div className='LeftSideContainer
                                                    my-auto h-[24em] min-w-[70%] md:min-w-[45%] lg:min-w-[35%] xl:min-w-[30%]
                                                    relative flex flex-col justify-between
                                                    rounded-xl bg-white shadow font-inter text-black'>
                                                    {/* Left Side Container */}
                                        <div className="TeamsLeft m-4 flex flex-col">
                                            {/* Teams Left Container */}
                                            <small className="text-base mb-1">Teams still available:</small>
                                            <big className="text-2xl font-bold">{32 - totalSupply}</big>
                                        </div>
                                        <WorldCupSweepStakeImg className='absolute w-full h-full' />
                                        {/* Sweepstacke Background Image */}
                                        <div className='flex flex-col justify-center m-4'>
                                            {/* Winnings and Button Container */}
                                            <div className="Winnings flex flex-col justify-center items-end">
                                                {/* Winnings Container */}
                                                <small className="text-base">Sweepstake pot:</small>
                                                <big className="text-2xl font-bold">{contractBalance} ETH</big>
                                                <small className="text-base">Your winnings:</small>
                                                <big className="text-2xl font-bold">{accountClaimable} ETH</big>
                                            </div>
                                            {hasMyNftInfo && accountClaimable > 0 &&
                                                /* Claim Container */
                                                <div className='Claim flex flex-col justify-center items-end my-2' >
                                                    <GradientButton text='Claim' onClick={() => { claim() }} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='RightSideContainer 
                                                    my-auto h-[24em] min-w-[70%] md:min-w-[45%] lg:min-w-[35%] xl:min-w-[30%]
                                                    flex flex-col justify-evenly 
                                                    font-inter text-black'>
                                        {/* Right Side Container */}
                                        <div className="TitleBtnContainer ml-4">
                                            {/* Container for Title and Button */}
                                            <div className="TitleContainer my-4">
                                                <big className="font-bold text-3xl">
                                                    {!hasMyNftInfo ? 'Get your team' : 'Your team(s)'}
                                                </big>
                                            </div>
                                            {/* Learn more Btn Container */}
                                            <div className="BtnContainer">
                                                {!hasMyNftInfo ?
                                                    <GradientButton text='Buy team (ETH 0.012)'
                                                        disabled={teamLimitReached}
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            buyandmint()
                                                        }} /> :
                                                    myNftInfos.map((nftInfo, index) => (
                                                        <div key={index} >
                                                            <CountryEmoji country={nftInfo.name} />
                                                            <big className={`font-extrabold text-gray-700 mt-3 ${nftInfo.inTournament ? "" : "line-through"}`}>
                                                                {nftInfo.name}
                                                            </big>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {/* Learn More Text and Button Outer Container */}
                                        <div className="TextAndLink ml-4 my-4">
                                            {/* Container for Text and Link */}
                                            <small className="text-xs">
                                                You can easily buy and sell sweepstake teams.
                                            </small>
                                            {/* Container for Button */}
                                            <div className='LinkContainer flex'>
                                                {/* TODO: replace with your organisation url */}
                                                <a href="https://www.bluesparrowapps.com/world-cup-sweepstake-learn-more/" className='bg-transparent text-button-violet hover:text-blue-500 focus:outline-none hover:no-underline'>
                                                    Learn More
                                                </a>
                                                <a href="https://www.bluesparrowapps.com/world-cup-sweepstake-learn-more/" className='bg-transparent text-button-violet hover:text-blue-500 focus:outline-none hover:no-underline'>
                                                   <ArrowRight className='h-6 w-8' />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='Footer w-full flex justify-center'>
                                {/* FOOTER Container */}
                                <ul className='my-8 text-xs sm:text-base list-none'>
                                    <li className='inline m-4'><a target='_blank' className='no-underline' href='https://www.bluesparrowapps.com/blockchain-developer-bristol/'>Blue Sparrow Apps</a></li>
                                    <li className='inline m-4'><a target='_blank' className='no-underline' href='https://github.com'>Github</a></li>
                                    <li className='inline m-4'><a target='_blank' className='no-underline' href='https://opensea.io/collection/world-cup-sweepstake'>OpenSea</a></li>
                                </ul>
                            </div>
                        </div>
                    }
                />               
            </Routes>
        </Router>
    );
}

export default App;