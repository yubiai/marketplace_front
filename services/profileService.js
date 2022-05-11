import axios from 'axios'

export const profileService = {
  login,
}

/**
 * Login
 * @param {str} walletAddress
 */
async function login(walletAddress) {
    console.log("arranco logimn profile services")
  return await axios.post(`/profiles/login`, {
    walletAddress,
  })
}
