import { createContext, useContext, useReducer } from 'react'

const GlobalStateContext = createContext()
const GlobalDispatchContext = createContext()

// Initial State
const initialState = {
  prices: '',
  search: '',
  pageIndex: 0,
  subCategory: '',
  meta: false,
  wallet: null,
  profile: null,
  autherror: null,
  yubiaiPaymentArbitrableInstance: null,
  arbitratorInstance: null,
  itemToCheckout: null,
  currencyPriceList: [],
  notificationsActive: false
}

// Reducers
const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTHPROFILE':
      return {
        ...state,
        profile: action.payload,
      }
    case 'AUTHERROR':
      return {
        ...state,
        autherror: action.payload,
      }
    case 'REFRESHPRICES':
      return {
        ...state,
        prices: action.payload,
      }
    case 'SEARCH':
      return {
        ...state,
        search: state.search,
      }
    case 'VERIFYMETA':
      return {
        ...state,
        meta: action.payload,
      }
    case 'WALLETACTIVE':
      return {
        ...state,
        wallet: action.payload,
      }
    case 'SET_YUBIAI_ARBITRABLE_INSTANCE':
      return {
        ...state,
        yubiaiPaymentArbitrableInstance: action.payload,
      }
    case 'SET_ARBITRATOR_INSTANCE':
      return {
        ...state,
        arbitratorInstance: action.payload
      }
    case 'SET_ITEM_TO_CHECKOUT':
      return {
        ...state,
        itemToCheckout: { ...action.payload },
      }
    case 'SET_CURRENCY_PRICE_LIST':
      return {
        ...state,
        currencyPriceList: [...action.payload],
      }
    case 'INCRPAGEINDEX':
      return {
        ...state,
        pageIndex: state.pageIndex + 1,
      }
    case 'DECRPAGEINDEX':
      return {
        ...state,
        pageIndex: state.pageIndex - 1,
      }
    case 'SELECTPAGEINDEX':
      return {
        ...state,
        pageIndex: action.payload - 1,
      }
    case 'RESETPAGEINDEX':
      return {
        ...state,
        pageIndex: initialState.pageIndex,
      }
    case 'SELECTSUBCATEGORY':
      return {
        ...state,
        subCategory: action.payload,
      }
    case 'ACTIVE_NOTIFICATIONS':
      return {
        ...state,
        notificationsActive: !initialState.notificationsActive,
      }
    default:
      throw new Error('Action Fail')
  }
}

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GlobalDispatchContext.Provider value={dispatch}>
      <GlobalStateContext.Provider value={state}>
        {children}
      </GlobalStateContext.Provider>
    </GlobalDispatchContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalStateContext)
export const useDispatchGlobal = () => useContext(GlobalDispatchContext)
