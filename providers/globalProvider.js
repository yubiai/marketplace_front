import { createContext, useContext, useReducer } from 'react'

const GlobalStateContext = createContext()
const GlobalDispatchContext = createContext()

// Initial State
const initialState = {
  prices: '',
  search: '',
  meta: false,
  profile: null,
  klerosEscrowInstance: {},
  itemsToCheckout: []
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
        klerosEscrowInstance: action.payload
      }
    case 'SET_ITEMS_TO_CHECKOUT':
      return {
        ...state,
        itemsToCheckout: [...action.payload]
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
