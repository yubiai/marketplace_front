import axios from 'axios'
import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { connectWallet, verifyNetwork } from '../utils/connectWeb3'

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    const authToken = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window && window.location ? window.ethereum : "null");

        const walletVerify = await connectWallet(provider)

        // Check with metamask
        if (!walletVerify) {
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
