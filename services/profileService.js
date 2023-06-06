import axios from 'axios'

/**
 * Login with POH
 * @param {str} walletAddress
 */
async function login(walletAddress) {
  return await axios.post(`/auth/loginpoh`, {
    walletAddress,
  })
}

/**
 * Login with Lens Protocol
 * @param {str} walletAddress
 */
async function loginLens(payload) {
  return await axios.post(`/auth/loginlens`, payload)
}

/**
 * Login with Sequence
 * @param {str} walletAddress
 */
async function loginSequence(walletAddress, email) {
  return await axios.post(`/auth/loginsq`, {
    walletAddress, email
  })
}

/**
 * Nonce
 */
async function nonce() {
  return await axios.get(`/auth/nonce`);
}

/**
 * Verify Signature
 */
async function verifySignature(message, signature) {
  return await axios.post(`/auth/verifysignature`, {
    message, signature
  });
}


/**
 * Get profile by _id
 */
async function getProfileFromId(_id, token) {
  return await axios.get(`/profiles/id/${_id}`, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null)
}

/**
 * Get Profile by eth adress
 * @param {str} id user
 */
async function getProfile(eth_address, token) {
  return await axios.get(`/profiles/${eth_address}`, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null)
}

/**
 * Get Favourites the perfil
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
 * Get Favourites the perfil
 * @param {str} profile
 */
async function getFavourites(profile, size, token) {
  return await axios.get(`/profiles/favourites/${profile}?size=${size || ""}`, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null)
}

/**
 * Add Favorite the perfil
 * @param {str} profile
 * @param {str} item
 */
async function addFavorite(profile, item, token) {
  return await axios.put(`/profiles/favourites/${profile}`, {
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
  return await axios.put(`/profiles/favourites/${profile}`, {
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

/**
 * Add Term in the Profile
 * @param {str} profile
 * @param {str} term
 */
async function addTerms(profile, term, token) {
  return await axios.put(`/profiles/terms/${profile}`, term, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null)
}

/**
 * Add Tour Accepted in the Profile
 * @param {str} profile
 */
 async function tourAccepted(profile, token) {
  return await axios.put(`/profiles/touraccepted/${profile}`, null, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null)
}


export const profileService = {
  login,
  loginLens,
  loginSequence,
  nonce,
  verifySignature,
  getProfileFromId,
  getProfile,
  updateProfile,
  getFavourites,
  addFavorite,
  removeFavorite,
  addTerms,
  tourAccepted
}
