import {
  parseItemIntoOrderTransaction
} from '../utils/orderUtils';


const loadOrderData = async (item = {}, currency) => {
  const seller = item.seller;

  const { eth_address } = seller;

  const result = parseItemIntoOrderTransaction(
    item,
    eth_address,
    currency
  )

  const { orderInfo, transaction } = result;

  return {
    orderInfo,
    transaction,
    time_for_service: item.time_for_service,
    time_for_claim: item.time_for_claim,
    typeprice: item.typeprice
  }
}



export {
  loadOrderData
}
