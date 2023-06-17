import { ethers } from 'ethers'
import genericErc20Abi from '../providers/Erc20.json'
import { etherscanService } from '../services/etherscanService'
import createKeccakHash from 'keccak';

// Login Metamask
const loginMetamask = async () => {
  if (!window.ethereum) {
    return null
  }

  try {

    let signerAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    return signerAddress[0]
  } catch (error) {
    if (error.code === 4001) {
      // User rejected request
      console.log(error.code)
    }
    console.log(error, 'error')
    return null
  }
}

// Verify Metamask
const verifyNetwork = async () => {

  const networkVersion = window.ethereum.networkVersion;

  if (networkVersion == 1 || networkVersion == 5 || networkVersion == 100 || networkVersion == 38 || networkVersion == 56 || networkVersion == 11155111) {
    return true
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    })
  
    return true;
  } catch (err){
    console.log(err);
    return false;
  }
}

// Balance Ubi Token ver 1
const balanceUbi1 = (wallet) => {
  let balance = new Promise((resolve, reject) => {
    etherscanService
      .getBalanceUbi(wallet && wallet.toLowerCase())
      .then((res) => {
        let oldBalance = res.data.result
        let newBalance = Number.parseFloat(`${oldBalance}e-18`).toFixed(2)
        resolve(newBalance)
      })
      .catch((err) => {
        console.log(err)
        reject(null)
      })
  })
  return balance
}

const balanceUbi2 = async (wallet) => {
  if (!window.ethereum) {
    return null
  }

  const tokenContractAddress = '0xDd1Ad9A21Ce722C151A836373baBe42c868cE9a4' //Ubi
  const _Provider = new ethers.providers.Web3Provider(window.ethereum)

  try {
    const newContract = new ethers.Contract(
      tokenContractAddress,
      genericErc20Abi,
      _Provider
    )
    let balance = await newContract.balanceOf(wallet)
    balance = ethers.utils.formatEther(balance)
    return balance
  } catch (error) {
    console.log(error, 'error')
    return null
  }
}


// EIP 55 address wallet
function toChecksumAddress(address) {
  return new Promise((resolve, reject) => {
    try {
      address = address.toLowerCase().replace('0x', '')
      var hash = createKeccakHash('keccak256').update(address).digest('hex')
      var ret = '0x'
    
      for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
          ret += address[i].toUpperCase()
        } else {
          ret += address[i]
        }
      }
    
      return resolve(ret)
    } catch (error) {
      console.error(error);
      return reject(false);
    }
  })
}

export { loginMetamask, verifyNetwork, balanceUbi1, balanceUbi2, toChecksumAddress }
