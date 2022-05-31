import axios from 'axios'

export const priceService = {
  getCurrencyPrices
}

async function getCurrencyPrices(protocol='') {
  let url = protocol ? `/prices?protocol=${protocol}` : '/prices'

  return await axios.get(url)
}
