import axios from 'axios'

export const dealService = {
  getItemSlugByDealId
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