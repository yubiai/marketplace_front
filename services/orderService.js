import axios from 'axios'

async function getOrderByTransaction(transactionId) {
  return await axios.get(`/orders/${transactionId}`)
}

async function createOrder(body) {
  return await axios.post('/orders/', {...body})
}

export const orderService = {
  getOrderByTransaction,
  createOrder
}