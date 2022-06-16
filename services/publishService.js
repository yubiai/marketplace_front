import axios from 'axios'

/**
 * NewItem
 * @param {str} data
 */
async function newItem(payload, token) {
  return await axios.post('/publish/', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : null,
    },
  })
}

export const publishService = {
  newItem,
}
