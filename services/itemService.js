import axios from 'axios'

export const itemService = {
  search,
  getItemById
}

/**
 * Search
 * @param {query} Search
 */

async function search(query) {
  return await axios.get(`/items/search?q=${query}`)
}


/**
 * Item by Id
 * @param {query} Search
 */
async function getItemById(id, token) {
  return await axios.get(
    `/items/item/id/${id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}