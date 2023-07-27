import { categoryService } from '../services/categoryService'
import { subcategoryService } from '../services/subcategoryService'
import {
  $getRoot,
} from 'lexical';

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

const getDescriptionSeo = (descriptionLexical) => {

  const data = JSON.parse(descriptionLexical);

  if (data && data.root && data.root.children && data.root.children[0] && data.root.children[0].children && data.root.children[0].children[0]) {
    const firstTextValue = data.root.children[0].children[0].text;
    return firstTextValue.slice(0, 150);
  } else {
    console.log('No se encontró el valor de "text" en el JSON o la estructura del JSON es incorrecta.');
    return "Yubiai Marketplace"
  }
}

export { getListCategory, getListSubCategory, getDescriptionSeo }
