import axios from 'axios'

/**
 * New Evidence
 * @param {str} data
 */
async function newEvidence(transactionId, payload, token) {
  return await axios.post(`/evidences/new/${transactionId}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : null,
    },
  })
}

/**
 * Evidence by id order
 * @param {query} Search
 */
 async function getEvidenceByOrderID(id, token) {
  return await axios.get(
    `/evidences/orderID/${id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

/**
 * Files Evidence by id order
 * @param {query} Search
 */
 async function getFilevidenceByOrderID(id, token) {
  return await axios.get(
    `/evidences/files/orderID/${id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

/**
 * Evidence by id
 * @param {query} Search
 */
 async function getEvidenceById(id, token) {
  return await axios.get(
    `/evidences/${id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

export const evidenceService = {
  newEvidence,
  getEvidenceById,
  getEvidenceByOrderID,
  getFilevidenceByOrderID
}
