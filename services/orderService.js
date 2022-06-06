import axios from 'axios'

async function getOrderByTransaction(transactionId) {
  return await axios.get(`/orders/${transactionId}`)
}

async function createOrder(body) {
  return await axios.post('/orders/', {...body})
}

async function updateOrderStatus(transactionId, status) {
  return await axios.put(`/orders/${transactionId}`, { status })
}

export const orderService = {
  getOrderByTransaction,
  createOrder,
  updateOrderStatus
}