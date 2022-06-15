import axios from 'axios'

/**
 * Login
 * @param {str} walletAddress
 */
async function login(walletAddress) {
  return await axios.post(`/auth/login`, {
    walletAddress,
  })
}

/**
 * Get profile by _id
 */
 async function getProfileFromId(_id, token) {
    return await axios.get(`/profiles/${_id}`,token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null)
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
async function updateProfile(profile, data, token) {
  return await axios.put(`/profiles/id/${profile}`, data, token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  : null
  )
}

/**
 * Get Favorites the perfil
 * @param {str} profile
 */
async function getFavorites(profile, size, token) {
  return await axios.get(`/profiles/favorites/${profile}?size=${size || ""}`, token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  : null)
}

/**
 * Add Favorite to the perfil
 * @param {str} profile
 * @param {str} item
 */
async function addFavorite(profile, item, token) {
  return await axios.put(`/profiles/favorites/${profile}`, {
    action: 'add',
    item_id: item._id,
  }, token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  : null)
}

/**
 * Remove Favorite to the perfil
 * @param {str} item
 * @param {str} item
 */
async function removeFavorite(profile, item, token) {
  return await axios.put(`/profiles/favorites/${profile}`, {
    action: 'remove',
    item_id: item._id,
  }, token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  : null)
}


export const profileService = {
  login,
  getProfileFromId,
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite
}
