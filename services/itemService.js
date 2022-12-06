import axios from 'axios'

export const itemService = {
  search,
  getItemById,
  purgeItem,
  updateItemById,
  deleteFileById
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
 * Update Item by Id
 * @param {query} Search
 */
 async function updateItemById(id, data, token) {
  return await axios.put(
    `/items/item/id/${id}`, data,
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
 * Update Item delete file by id
 * @param {query} Search
 */
 async function deleteFileById(id, data, token) {
  return await axios.put(
    `/items/item/deletefile/${id}`, data,
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