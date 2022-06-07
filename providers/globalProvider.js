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
  profile: null,
  klerosEscrowInstance: null,
  itemsToCheckout: [],
  currencyPriceList: [],
}

// Reducers
const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTHPROFILE':
      return {
        ...state,
        profile: action.payload,
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
    case 'SET_KLEROS_ESCROW_INSTANCE':
      return {
        ...state,
        klerosEscrowInstance: action.payload,
      }
    case 'SET_ITEMS_TO_CHECKOUT':
      return {
        ...state,
        itemsToCheckout: [...action.payload],
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
