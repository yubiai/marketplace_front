import { categoryService } from '../services/categoryService'
import { subcategoryService } from '../services/subcategoryService'

const getListCategory = () => {
  let categories = new Promise((resolve, reject) => {
    try {
      const result = categoryService.getCategories()
      resolve(result)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
  return categories
}

const getListSubCategory = (categoryId) => {
  let categories = new Promise((resolve, reject) => {
    try {
      const result = subcategoryService.getSubCategories(categoryId)
      resolve(result)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
  return categories
}

export { getListCategory, getListSubCategory }
