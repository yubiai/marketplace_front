import axios from 'axios'

export const itemService = {
  newItem,
  search,
}

/**
 * NewItem
 * @param {str} data
 */

async function newItem(payload) {
  return await axios.post(`/items/new`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * Search
 * @param {query} Search
 */

async function search(query) {
  return await axios.get(`/items/search?q=${query}`)
}
