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

/**
 * Update Status
 * @param {str} id
 * @param {str} status
 */
 async function updateStatusItem(id, data, token) {
  return await axios.put(`/publish/status/${id}`, data, token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : null
  )
}


/**
 * Update Item Files
 * @param {str} data
 */
 async function updateItemFiles(id, payload, token) {
  return await axios.put(`/publish/edititemfiles/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : null,
    },
  })
}

export const publishService = {
  newItem,
  updateStatusItem,
  updateItemFiles
}
