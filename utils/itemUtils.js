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

const getDescriptionSeo = (descriptionLexical) => {

  const data = JSON.parse(descriptionLexical);

  if (data && data.root && data.root.children && data.root.children[0] && data.root.children[0].children && data.root.children[0].children[0]) {
    const firstTextValue = data.root.children[0].children[0].text;
    return firstTextValue.slice(0, 150);
  } else {
    return "Yubiai Marketplace"
  }
}

const convertTimeToReadable = (time, t) => {
  const days = Math.floor(time);
  const hours = Math.round((time - days) * 24); // Multiplicamos la parte decimal por 24 para obtener las horas
  const dayText = days === 1 ? 'day' : 'days';
  const hourText = hours === 1 ? 'hour' : 'hours';

  return `${days} ${t(dayText)} ${hours} ${t(hourText)}`;
}

export { getListCategory, getListSubCategory, getDescriptionSeo, convertTimeToReadable }
