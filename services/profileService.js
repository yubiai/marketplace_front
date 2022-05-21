import axios from 'axios'
import jwtDecode from 'jwt-decode';



/**
 * Login
 * @param {str} walletAddress
 */
async function login(walletAddress) {
  return await axios.post(`/profiles/login`, {
    walletAddress,
  })
}

/**
 * Get Current User
 */
async function getCurrentUser() {
  try {
      const token = localStorage.getItem("YBI-token");
      const decodeToken = await jwtDecode(token)
      return decodeToken
  } catch (error) {
      return null;
  }
}

export const profileService = {
  login,
  getCurrentUser
}