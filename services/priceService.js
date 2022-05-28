import axios from 'axios'

export const priceService = {
  getCurrencyPrices
}

async function getCurrencyPrices() {
  return await axios.get('/prices')
}
