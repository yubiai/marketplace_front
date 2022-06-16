import axios from 'axios'

export const itemService = {
  search,
}

/**
 * Search
 * @param {query} Search
 */

async function search(query) {
  return await axios.get(`/items/search?q=${query}`)
}
