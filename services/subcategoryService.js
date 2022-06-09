import axios from 'axios'

export const subcategoryService = {
  getSubCategories
}

/**
 * Get List SubCategories
 * @param {str} data
 */

async function getSubCategories(categoryId) {
  return await axios.get(
    `/subcategories/${categoryId}`
  )
}
