const ethers = require('ethers');

const config = {

  // Once you have deployed the contract, replace the address below with the address of the contract
  contractAddress: '0x2737462A68798623F3Ef2956A04eD503300c751E',
  networkName: 'Ethereum Mainnet',
  etherScanUrl: 'https://etherscan.io/tx/',
  openSeaUrl: 'https://opensea.io/account?search[sortBy]=CREATED_DATE&search[sortAscending]=false',
  networkParams: {
    chainId: '0x1'
  },


  contractABI: [
    "function totalSupply() public view returns (uint256)",
    "function cost() public view returns (uint256)",
    "function revealed() public view returns (bool)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "function mint(address to, uint256 amount) public returns (bool)",
    "function maxMintAmount() public view returns (uint256)",
    
  
  ]
};

async function verifyWalletConnection({ noAlert } = {}) {
  if (!window.ethereum) {
    // noAlert || alertUser('Please install MetaMask to interact with this feature');
    return;
  }

  if (!window.ethereum.selectedAddress && noAlert && localStorage.getItem('verifyWalletRequested') === '1') {
    return;
  }

  // localStorage.setItem('verifyWalletRequested', '1');
  let accounts;
  try {
    
    await new Promise(resolve => setTimeout(resolve, 300));
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

   
  } catch (error) {
    if (error.code == -32002) {
      // noAlert || alertUser('Please open your MetaMask and select an account');
      return;
    } else if (error.code == 4001) {
      // noAlert || alertUser('Please connect with MetaMask');
      return;
    } else {
      throw error;
    }
  }
  
  return accounts[0];
}

let globalState;

function displayMessage(message) {
  document.querySelector('.mint-section-not-connected').classList.add('hidden');
  document.querySelector('.mint-section-connected').classList.add('hidden');
  document.querySelector('.mint-section-error').classList.remove('hidden');
  document.querySelector('.mint-section-error').querySelector('p').innerHTML = message;
}

function getMintAmount() {
  document.querySelector('.mint-amount').addEventListener('input', function(e) {
    updateMintAmount(BigInt(e.target.value));
  })
}

function updateMintAmount(amount, max) {
  amount = +amount;
  max = max || globalState.maxValue;
  if (amount > max) {
    amount = max;
  }
  
  if (amount < 1) {
    amount = 1;
  }

  document.querySelector('.mint-amount').value = amount;
}

async function updateGlobalState() {
  displayMessage('<svg height="128" width="128"><circle cx="64" cy="64" fill="none" r="56" stroke="rgb(21, 44, 91)" stroke-dasharray="87.96459430051421" stroke-dashoffset="74.76990515543707" stroke-width="16" class="nft-modal-stage-loading"></circle></svg>');
  const address = window.ethereum.selectedAddress;
  const contract = new ethers.Contract(config.contractAddress, config.contractABI, new ethers.providers.Web3Provider(window.ethereum));
  if (!(await contract.revealed())) {
    return displayMessage('Release of the genesis collection will be held on the 12th of January, 2022.');
  }

  const maxValue = await contract.maxMintAmount.toString();

  updateMintAmount(getMintAmount(), maxValue);

  const cost = await contract.cost();
  const totalSupply = await contract.totalSupply();
  const freeTokens = +(await contract.cost).toString();

  document.querySelector('.mint-supply').innerHTML = `${totalSupply.toString()}/1000`;
  
  document.querySelector('.mint-section-not-connected').classList.add('hidden');
  document.querySelector('.mint-section-error').classList.add('hidden');
  document.querySelector('.mint-section-connected').classList.remove('hidden');

  globalState = {
    maxValue,
    contract,
    cost,
    totalSupply,
    address,
    freeTokens
  };
}

module.exports = {
  init: function() {
    setInterval(function updateConnectButton() {
      const button = document.querySelector('.navbar-wallet-button');
      const addr = window.ethereum.selectedAddress;
      if (button && addr && window.ethereum.chainId === config.networkParams.chainId) {
        const cropped = addr.slice(0, 5) + '...' + addr.slice(-5);
        button.querySelector('.connect-wallet-text').innerHTML = cropped;
        button.querySelector('.dot').classList.add('active');

        // document.querySelector('.mint-section-not-connected').classList.add('hidden');
        // document.querySelector('.mint-section-connected').classList.remove('hidden');

        if (!globalState || globalState.address != addr) {
          globalState = {};
          globalState.address = addr;
          updateGlobalState();
        }
      } else {
        button.querySelector('.connect-wallet-text').innerHTML = 'Connect Wallet';
        button.querySelector('.dot').classList.remove('active');
        
        document.querySelector('.mint-section-not-connected').classList.remove('hidden');
        document.querySelector('.mint-section-error').classList.add('hidden');
        document.querySelector('.mint-section-connected').classList.add('hidden');
      }
    }, 100);

    document.querySelector('.navbar-wallet-button').addEventListener('click', function (ev) {
      ev.preventDefault();
      verifyWalletConnection();
    });

    document.querySelector('.connect-wallet-button').addEventListener('click', function (ev) {
      ev.preventDefault();
      verifyWalletConnection();
    });

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('mint-number-circle')) {
        updateMintAmount(event.target.innerHTML);
      }
    });

    document.querySelector('.mint-left-arrow').addEventListener('click', function (ev) {
      updateMintAmount(getMintAmount() - 1);
    });

    document.querySelector('.mint-right-arrow').addEventListener('click', function (ev) {
      updateMintAmount(getMintAmount() + 1);
    });

    const mintButton = document.querySelector('.mint-button');
    mintButton.addEventListener('click', async () => {
      mintButton.disabled = true;
      try {
        console.log('minting!!!')
        const mintAmount = getMintAmount();
        const amountForPay = Math.max(0, mintAmount - globalState.freeTokens);
        const requiredAmount = globalState.cost.mul(amountForPay);
        const iface = new ethers.utils.Interface(config.contractABI);
        const params = iface.encodeFunctionData('mint', [ethers.utils.mintAmount]);
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: window.ethereum.selectedAddress,
              to: config.contractAddress,
              value: requiredAmount.toString(),
              data: params
            },
          ],
        });
  
        displayMessage(`
          Transaction submitted.
          <br>
          Please wait for confirmation.
          <br>
          <a target="_blank" href="${config.etherScanUrl}${txHash}">View on EtherScan</a>
          <br>
          <svg height="128" width="128"><circle cx="64" cy="64" fill="none" r="56" stroke="rgb(21, 44, 91)" stroke-dasharray="87.96459430051421" stroke-dashoffset="74.76990515543707" stroke-width="16" class="nft-modal-stage-loading"></circle></svg>
        `);
  
        try {
          const tx = await (new ethers.providers.Web3Provider(window.ethereum)).getTransaction(txHash);
          const txReceipt = await tx.wait();
          console.log(txReceipt);
          displayMessage('NFTs minted successfully!');
          displayMessage(`
            NFTs succesfully minted!
            <br>
            <a target="_blank" href="${config.etherScanUrl}${txHash}">View on EtherScan</a>
            <br>
            <a target="_blank" href="${config.openSeaUrl}">
              View your NFTs on OpenSea
            </a>
            <br>
            <button class="mint-more-button">Mint more</button>
          `);
          document.querySelector('.mint-more-button').addEventListener('click', async function (ev) {
            mintButton.disabled = false;
            await updateGlobalState();
          });
        } catch (err) {
          console.log('TX ERROR', err);
          displayMessage('There was an error with your transaction. Please try again.');
        }
      } catch (err) {
        // TODO handle error
        console.log('TX ERROR', err);
      }
      mintButton.disabled = false;
    });
  }
}