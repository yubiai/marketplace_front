import axios from 'axios'

export const subcategoryService = {
  getSubCategories,
  getSubCategoryById
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

/**
 * Get Sub Category By ID
 * @param {str} data
 */

 async function getSubCategoryById(id) {
  return await axios.get(
    `/subcategories/id/${id}`
  )
}
