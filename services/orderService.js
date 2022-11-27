import axios from 'axios'

async function getOrderByTransaction(transactionId, token) {
  return await axios.get(
    `/orders/${transactionId}`, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null)
}

async function getOrderByOrderId(orderId, token) {
  return await axios.get(
    `/orders/byorder/${orderId}`, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null)
}

async function createOrder(body, token) {
  return await axios.post(
    '/orders/', {...body},
    token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}

async function updateOrderStatus(transactionId, status, token) {
  return await axios.put(
    `/orders/${transactionId}`, { status },
    token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}

async function setDisputeOnOrderTransaction(transactionId, disputeId, token) {
  return await axios.post(
    `/orders/${transactionId}/set-dispute`, { disputeId },
    token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}

async function getOrdersBySeller(sellerWallet, token) {
  return await axios.get(
    `/orders/seller/${sellerWallet.toUpperCase()}`,
    token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : null)
}

export const orderService = {
  getOrderByTransaction,
  createOrder,
  updateOrderStatus,
  setDisputeOnOrderTransaction,
  getOrdersBySeller,
  getOrderByOrderId,
}