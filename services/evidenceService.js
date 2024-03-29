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
 * Evidences by dealId
 * @param {query} dealId
 */
async function getEvidencesByDealId(dealId, token) {
  return await axios.get(
    `/evidences/all/dealid/${dealId}`,
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

/**
 * Update Evidence status
 * @param {query} id
 */
async function updateStatus(id, payload, token) {
  return await axios.put(
    `/evidences/status/${id}`, payload,
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
 * Remove Evidence by id
 * @param {query} Search
 */
async function removeEvidenceOld(id, token) {
  return await axios.delete(
    `/evidences/removeold/${id}`,
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
  getEvidencesByDealId,
  getEvidenceByOrderID,
  getFilevidenceByOrderID,
  updateStatus,
  removeEvidenceOld
}
