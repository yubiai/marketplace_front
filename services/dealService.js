import axios from 'axios'

export const dealService = {
  getItemSlugByDealId,
  getEvidenceByClaimID,
  validateSignature
}

/**
 * Get Slug by deal Id
 * @param {str} deal_id
 */

async function getItemSlugByDealId(deal_id) {
  return await axios.get(
    `/deal/${deal_id}`
  )
}


/**
 * Get Evidence by claimID
 * @param {str} claimID
 */

async function getEvidenceByClaimID(claimID) {
  return await axios.get(
    `/deal/claim/${claimID}`
  )
}

async function validateSignature(payload){
  return await axios.post("/deal/validatesignature/", payload);
}