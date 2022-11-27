import axios from 'axios'

export const itemService = {
  search,
  getItemById,
  purgeItem
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

/**
 * Purge Item
 * @param {query} Search
 */
async function purgeItem(slug, token) {
  return await fetch(`/api/revalidatepupurge?path=${slug}`, {
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token ? token : null}`,
    }
  });
}