import axios from 'axios'

export const priceService = {
  getCurrencyPrices
}

async function getCurrencyPrices(protocol='', token) {
  let url = protocol ? `/prices?protocol=${protocol}` : '/prices'

  return await axios.get(url, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null)
}
