import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useAccount, useDisconnect } from 'wagmi'

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatchGlobal();
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const authToken = async () => {
      try {
        // Check with Loggin rainbowkit
        if (!isConnected) {
          throw "No Wallet"
        }

        const YubiaiLs =
          typeof window !== 'undefined' && localStorage.getItem('Yubiai')
            ? localStorage.getItem('Yubiai')
            : null
        const Yubiai = YubiaiLs ? JSON.parse(YubiaiLs) : null

        const Ybcookies = Cookies.get('Yubiai') ? Cookies.get('Yubiai') : null

        if (!Yubiai && !Ybcookies) {
          throw "No Token"
        }

        const response = Yubiai
          ? await axios.get('/auth/session/', {
              headers: {
                Authorization: `Bearer ${
                  Yubiai.token ? Yubiai.token : Ybcookies
                }`,
              },
            })
          : null

        const user =
          response && response.data && response.data.walletAddress
            ? await profileService.getProfile(
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
          if(isConnected){
            disconnect();
          }
          router.push('/logout')
          return
        }
      } catch (err) {
        console.error(err, "Not connected");
        if(isConnected){
          disconnect();
        }
        return
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
