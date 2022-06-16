import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { loginMetamask } from '../utils/ethereum'
import { useDispatchGlobal } from './globalProvider'

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

        const response = Yubiai
          ? await axios.get(
              '/auth/session/',
              Yubiai && Yubiai.token
                ? {
                    headers: {
                      Authorization: `Bearer ${Yubiai.token}`,
                    },
                  }
                : null
            )
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
