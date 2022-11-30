import axios from 'axios'

export const categoryService = {
  getCategories,
  getCategoryById
}

/**
 * Get List Categories
 * @param {str} data
 */

async function getCategories() {
  return await axios.get(
    `/categories/`
  )
}

/**
 * Get Category By ID
 * @param {str} data
 */

 async function getCategoryById(id) {
  return await axios.get(
    `/categories/${id}`
  )
}
