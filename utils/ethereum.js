import { ethers } from 'ethers'
import genericErc20Abi from '../providers/Erc20.json'

// Login Metamask
const loginMetamask = async () => {
  if (!window.ethereum) {
    console.log('no hay metamask')
    return null
  }

  try {
    let signerAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
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

// Balance Ubi Token ver 1
const balanceUbi = async (wallet) => {
  if (!window.ethereum) {
    console.log('no hay metamask')
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
    console.log(balance)
    balance = ethers.utils.formatEther(balance)
    return balance
  } catch (error) {
    console.log(error, 'error')
    return null
  }
}

export { loginMetamask, balanceUbi }
