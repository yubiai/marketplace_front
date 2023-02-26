import Web3 from 'web3';
import YubiaiPaymentArbitrable from '../utils/escrow-utils/yubiaiPaymentArbitrable';
import { priceService } from '../services/priceService';
import {
  getProtocolNamingFromNetwork,
  parseItemIntoOrderTransaction,
  parseFromAToBToken
} from '../utils/orderUtils';
import { getCurrentNetwork } from '../utils/walletUtils';
import Arbitrator from '../utils/escrow-utils/arbitrator';

const getAccount = async () => {
  const web3 = getWeb3Instance();
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

const getWeb3Instance = () => {
  const networkItem = getCurrentNetwork();
  console.log(networkItem, "networkItemnetworkItem12")
  const settings = getSettingsByNetwork(networkItem.aliasTitle);

  return new Web3(
    settings.NEXT_PUBLIC_INFURA_ENDPOINT ||
    new Web3.providers.HttpProvider('http://localhost:8545')
  );
}

const loadOrderData = async (item = {}, currencyPriceList = [], ethPrice = false) => {
  const seller = item.seller;
  const currencySymbol = ethPrice ? 'ETH' : item.currencySymbolPrice;

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
  const web3 = getWeb3Instance();
  const arbitratorInstance = new Arbitrator(web3, account);
  dispatch({
    type: 'SET_ARBITRATOR_INSTANCE',
    payload: arbitratorInstance
  })
}

const setYubiaiInstance = async dispatch => {
  const web3 = getWeb3Instance();
  const yubiaiArbitrableInstance = new YubiaiPaymentArbitrable(
    web3, global?.profile?.eth_address.toLowerCase());
  await yubiaiArbitrableInstance.initContract();

  dispatch({
    type: 'SET_YUBIAI_ARBITRABLE_INSTANCE',
    payload: yubiaiArbitrableInstance,
  })
}

const getSettingsByNetwork = networkType => {
  if (networkType === 'goerli') {
    return {
      NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK_GOERLI,
      NEXT_PUBLIC_INFURA_ENDPOINT: process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GOERLI
    }
  }
  if (networkType === 'sepolia') {
    return {
      NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK_SEPOLIA,
      NEXT_PUBLIC_INFURA_ENDPOINT: process.env.NEXT_PUBLIC_INFURA_ENDPOINT_SEPOLIA
    }
  }
  return {
    NEXT_PUBLIC_NETWORK: '',
    NEXT_PUBLIC_INFURA_ENDPOINT: ''
  }
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
  getSettingsByNetwork,
  setArbitratorInstance,
}
