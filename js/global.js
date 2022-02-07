localforage.config({    
    name: 'billboardsDAO',
    description: 'billboardsDAO database'  
});

/*
billboardsDAO keys:

billboards_count (=> uint) number of billboards in database syncronized

1 
2
3 
... (=> billboard hash)

-------------------

lat;long 


*/


// from https://docs.harmony.one/home/developers/wallets/metamask/using-metamask-with-harmony-smart-contracts

import detectEthereumProvider from "@metamask/detect-provider";

let ethAddress;
let isAuthorised = false;

const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    console.error("Not found accounts");
  } else {
    ethAddress = accounts[0];

    console.log("Your address: ", ethAddress);
  }
};

export const signInMetamask = async () => {
  const provider = await detectEthereumProvider();

  // @ts-ignore
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }

  if (!provider) {
    console.error("Metamask not found");
    return;
  }

  // MetaMask events
  provider.on("accountsChanged", handleAccountsChanged);

  provider.on("disconnect", () => {
    console.log("disconnect");
    isAuthorised = false;
  });

  provider.on("chainIdChanged", (chainId) =>
    console.log("chainIdChanged", chainId)
  );

  provider
    .request({ method: "eth_requestAccounts" })
    .then(async (params) => {
      handleAccountsChanged(params);
      isAuthorised = true;
    })
    .catch((err) => {
      isAuthorised = false;

      if (err.code === 4001) {
        console.error("Please connect to MetaMask.");
      } else {
        console.error(err);
      }
    });
};

/////////////////////////////

import Web3 from "web3";
import fs from "fs";
//let but = document.getElementById("inputtButton");

let web3;
let contract;

async function setupContract() {
  /*let contractFile = fs.readFileSync("../build/contracts/Counter.json", {
    encoding: "UTF-8",
  });
  contractFile = JSON.parse(contractFile);
  const abi = contractFile.abi;
  const contractAddress = contractFile.networks["2"].address;
  await signInMetamask();
  web3 = new Web3(window.web3.currentProvider);

  const contractInstance = new web3.eth.Contract(abi, contractAddress);
  contract = contractInstance;*/
}

setupContract();


