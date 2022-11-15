import Web3 from 'web3';
import YubiaiPaymentArbitrable from '../utils/escrow-utils/yubiaiPaymentArbitrable';
import { priceService } from '../services/priceService';
import {
  getProtocolNamingFromNetwork,
  parseItemIntoOrderTransaction,
  parseFromAToBToken
} from '../utils/orderUtils';
import Arbitrator from '../utils/escrow-utils/arbitrator';


let web3 = new Web3(
  process.env.NEXT_PUBLIC_INFURA_ENDPOINT ||
  new Web3.providers.HttpProvider('http://localhost:8545')
);

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

const loadOrderData = async (item = {}, currencyPriceList = [], ethPrice=false) => {
  const seller = item.seller;
  const currencySymbol = ethPrice ? 'ETH' : item.currencySymbolPrice || 'ETH';

  const { eth_address } = seller;

  const currencyContract = currencyPriceList.length ? currencyPriceList.find(
      currencyItem => currencyItem.symbol === currencySymbol) : {};

  if (ethPrice) {
    const _contract = currencyPriceList.length ? currencyPriceList.find(
      currencyItem => currencyItem.symbol === item.currencySymbolPrice) : {};

    item.price = item.currencySymbolPrice !== 'ETH' ? parseFromAToBToken(
      item.price, _contract, currencyContract) : item.price
  }

  const result = parseItemIntoOrderTransaction(
    item,
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

const setYubiaiInstance = async dispatch => {
  const yubiaiArbitrableInstance = new YubiaiPaymentArbitrable(
    web3, global?.profile?.eth_address.toLowerCase());
  await yubiaiArbitrableInstance.initContract();

  dispatch({
    type: 'SET_YUBIAI_ARBITRABLE_INSTANCE',
    payload: yubiaiArbitrableInstance,
  })
}

const loadCurrencyPrices = async (dispatch, global, networkType) => {
  const naming = getProtocolNamingFromNetwork(networkType);
  const resp = await priceService.getCurrencyPrices(
    naming, global && global.profile && global.profile.token);
  const { data } = resp;
  dispatch({
      type: 'SET_CURRENCY_PRICE_LIST',
      payload: [...data],
  });
}

export {
  setYubiaiInstance,
  loadCurrencyPrices,
  loadOrderData,
  getAccount,
  setArbitratorInstance
}
