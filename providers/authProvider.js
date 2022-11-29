import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { loginMetamask, verifyNetwork } from '../utils/ethereum'
import { useDispatchGlobal, useGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    const authToken = async () => {
      try {
        const signerAddress = await loginMetamask()

        // Check with metamask
        if (!signerAddress) {
          return
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

        const verifyNetWorkChainID = await verifyNetwork();

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
          if(!verifyNetWorkChainID){
            router.push('/logout')
          }
          dispatch({
            type: 'AUTHPROFILE',
            payload: { ...user.data, token: Yubiai.token },
          })
          return
        } else {
          router.push('/logout')
          return
        }
      } catch (err) {
        console.error(err, "Error Auth")
        return
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
