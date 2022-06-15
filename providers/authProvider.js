import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    const authToken = async () => {
      const YubiaiLs =
        typeof window !== 'undefined' ? localStorage.getItem('Yubiai') : null
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
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
