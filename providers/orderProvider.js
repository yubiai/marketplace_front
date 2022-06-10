import KlerosEscrow from '../utils/escrow-utils/kleros-escrow'
import Web3 from 'web3'

import { priceService } from '../services/priceService'
import {
  getProtocolNamingFromNetwork,
  parseItemIntoOrderTransaction,
  parseFromAToBToken
} from '../utils/orderUtils'
import Arbitrator from '../utils/escrow-utils/arbitrator';


let web3 = new Web3(
  process.env.NEXT_PUBLIC_INFURA_ENDPOINT ||
  new Web3.providers.HttpProvider('http://localhost:8545')
);

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

const loadOrderData = async (items = [], currencyPriceList = [], ethPrice=false) => {
  let copyItems = [...items];
  const seller = copyItems[0].seller;
  const currencySymbol = ethPrice ? 'ETH' : copyItems[0].currencySymbolPrice || 'ETH';

  const { eth_address } = seller;

  const currencyContract = currencyPriceList.length ? currencyPriceList.find(
      currencyItem => currencyItem.symbol === currencySymbol).token_address : {};

  if (ethPrice) {
    const _contract = currencyPriceList.length ? currencyPriceList.find(
      currencyItem => currencyItem.symbol === copyItems[0].currencySymbolPrice).token_address : {};

    copyItems = copyItems.map(item => ({
      ...item,
      price: item.currencySymbolPrice !== 'ETH' ?
        parseFromAToBToken(
          item.price, _contract, currencyContract) :
        item.price
    }));
  }

  const result = parseItemIntoOrderTransaction(
    copyItems,
    eth_address,
    currencyContract
  )

  const { orderInfo, transaction } = result;

  return {
    orderInfo,
    transaction
  }
}

const setArbitratorInstance = (account, dispatch) => {
  // NOTE: Web3 instance has the correct infura endpoint?
  const arbitratorInstance = new Arbitrator(web3, account);
  dispatch({
    type: 'SET_ARBITRATOR_INSTANCE',
    payload: arbitratorInstance
  })
}

const setKlerosInstance = (transactionData, dispatch) => {
  const klerosEscrowRef = new KlerosEscrow(web3);
  klerosEscrowRef.setCourtAndCurrency(
    'general', (transactionData.amount || {}).currency)

  dispatch({
    type: 'SET_KLEROS_ESCROW_INSTANCE',
    payload: klerosEscrowRef,
  })
}

const loadCurrencyPrices = async (dispatch) => {
  const naming = getProtocolNamingFromNetwork();
  const resp = await priceService.getCurrencyPrices(naming);
  const { data } = resp;
  dispatch({
      type: 'SET_CURRENCY_PRICE_LIST',
      payload: [...data],
  });
}

export {
  setKlerosInstance,
  loadCurrencyPrices,
  loadOrderData,
  getAccount,
  setArbitratorInstance
}
