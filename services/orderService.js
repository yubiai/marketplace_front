import axios from 'axios'

const BACKEND_API = process.env.BACKEND_API || 'http://localhost:4000';

async function getOrderByTransaction(transactionId) {
  return await axios.get(`${BACKEND_API}/api/orders/${transactionId}`)
}

async function createOrder(body) {
  return await axios.post(`${BACKEND_API}/api/orders/`, {...body})
}

export const orderService = {
  getOrderByTransaction,
  createOrder
}