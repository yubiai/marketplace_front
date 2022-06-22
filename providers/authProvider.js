import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { loginMetamask } from '../utils/ethereum'
import { useDispatchGlobal } from './globalProvider'
import Cookies from 'js-cookie'

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    const authToken = async () => {
      try {
        await loginMetamask()

        const YubiaiLs =
          typeof window !== 'undefined' && localStorage.getItem('Yubiai')
            ? localStorage.getItem('Yubiai')
            : null
        const Yubiai = YubiaiLs ? JSON.parse(YubiaiLs) : null

        const Ybcookies = Cookies.get('Yubiai') ? Cookies.get('Yubiai') : null

        const response = Yubiai
          ? await axios.get('/auth/session/', {
              headers: {
                Authorization: `Bearer ${Yubiai.token ? Yubiai.token : Ybcookies}`,
              }
            })
          : null

        const user =
          response && response.data && response.data.walletAddress
            ? await profileService.getProfileFromId(
                response.data.walletAddress,
                Yubiai.token
              )
            : null

        if (user && user.status === 200) {
          dispatch({
            type: 'AUTHPROFILE',
            payload: { ...user.data, token: Yubiai.token },
          })
          return
        } else {
          dispatch({
            type: 'AUTHPROFILE',
            payload: null,
          })
          return
        }
      } catch (err) {
        dispatch({
          type: 'AUTHPROFILE',
          payload: null,
        })
        localStorage.removeItem('Yubiai')
        return
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
