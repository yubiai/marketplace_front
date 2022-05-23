import { subcategoryService } from '../services/subcategoryService'

const getListSubCategory = () => {
  let categories = new Promise((resolve, reject) => {
    try {
      const result = subcategoryService.getSubCategories()
      resolve(result)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
  return categories
}

export { getListSubCategory }
