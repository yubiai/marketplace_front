import axios from 'axios'

export const channelService = {
  getChannelByOrderId,
  getMessagesByOrderId,
  pushMsg,
  pushMsgWithFiles,
  createChannel,
  findChannel
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

async function getChannelByOrderId(orderid, token) {
  return await axios.get(
    `/channel/orderid/${orderid}`,token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}

async function getMessagesByOrderId(orderid, token) {
  return await axios.get(
    `/channel/messagesbyorder/${orderid}`,token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
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

async function pushMsgWithFiles(orderid, payload, token){
  return await axios.post(`/channel/pushmsgwithfiles/${orderid}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : null,
    },
  });
}

async function findChannel(payload, token){
  return await axios.post(
    '/channel/find/', payload, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null
  )
}