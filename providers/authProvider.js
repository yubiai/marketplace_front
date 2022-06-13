import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    return async () => {
      console.log('Verificacion AUTH')
/*       const dataToken = await profileService.getCurrentUser()
      if (dataToken && dataToken.walletAddress) {
        const result = await profileService.login(dataToken.walletAddress);
        const data = result.data.data;

        dispatch({
          type: 'AUTHPROFILE',
          payload: data
        })
        const yubiaiLS = {
          token: result.data.token,
          wallet: data.eth_address
        }
        localStorage.setItem('Yubiai', yubiaiLS)
      } */
    }
  }, [])
  return <>{children}</>
}

export default AuthProvider
