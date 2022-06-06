import axios from 'axios'
import jwtDecode from 'jwt-decode'

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
    const yubiaiLS = localStorage.getItem('Yubiai')
    const decodeToken = await jwtDecode(JSON.parse(yubiaiLS.token))
    return decodeToken
  } catch (error) {
    return null
  }
}

/**
 * Get profile by _id
 */
 async function getProfileFromId(_id) {
  try {
    return await axios.get(`/profiles/${_id}`)
  } catch (error) {
    return null;
  }
}

/**
 * Get Favorites the perfil
 * @param {str} id user
 */
async function getProfile(eth_address) {
  return await axios.get(`/profiles/${eth_address}`)
}

/**
 * Get Favorites the perfil
 * @param {str} id user
 * @param {str} data
 */
async function updateProfile(profile, data) {
  return await axios.put(`/profiles/${profile}`, data)
}

/**
 * Get Favorites the perfil
 * @param {str} profile
 */
async function getFavorites(profile) {
  return await axios.get(`/profiles/favorites/${profile}`)
}

/**
 * Add Favorite to the perfil
 * @param {str} profile
 * @param {str} item
 */
async function addFavorite(profile, item) {
  return await axios.put(`/profiles/favorites/${profile}`, {
    action: 'add',
    item_id: item._id,
  })
}

/**
 * Remove Favorite to the perfil
 * @param {str} item
 * @param {str} item
 */
async function removeFavorite(profile, item) {
  return await axios.put(`/profiles/favorites/${profile}`, {
    action: 'remove',
    item_id: item._id,
  })
}

/**
 * Get Favorites the perfil
 * @param {str} profile
 */
 async function getMyPublished(profile) {
  return await axios.get(`/profiles/my_published/${profile}`)
}

export const profileService = {
  login,
  getCurrentUser,
  getProfileFromId,
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getMyPublished
}
