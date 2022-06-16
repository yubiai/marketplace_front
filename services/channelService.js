import axios from 'axios'

export const channelService = {
  getChannelByOrderId,
  pushMsg,
  createChannel
}

/**
 * Get List SubCategories
 * @param {str} data
 */

 async function createChannel(body = {}, token) {
  return await axios.post('/channel', {...body}, token
  ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  : null)
}

async function getChannelByOrderId(orderid) {
  return await axios.get(
    `/channel/orderid/${orderid}`
  )
}

async function pushMsg(orderid, message, token){
  return await axios.post(
    `/channel/pushmsg/${orderid}`, message, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}
