import axios from 'axios'

export const channelService = {
  getChannelByOrderId,
  pushMsg
}

/**
 * Get List SubCategories
 * @param {str} data
 */

async function getChannelByOrderId(orderid) {
  return await axios.get(
    `/channel/orderid/${orderid}`
  )
}

async function pushMsg(orderid, message){
  console.log(orderid, message)
  return await axios.post(
    `/channel/pushmsg/${orderid}`, message
  )
}
