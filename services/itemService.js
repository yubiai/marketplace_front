import axios from 'axios'

export const itemService = {
  newItem
}

/**
 * NewItem
 * @param {str} data
 */

async function newItem(payload) {
  return await axios.post(`/items/item`, {
    payload
  })
}