import axios from 'axios'

export const categoryService = {
  getCategories
}

/**
 * Get List SubCategories
 * @param {str} data
 */

async function getCategories() {
  return await axios.get(
    `/categories/`
  )
}
