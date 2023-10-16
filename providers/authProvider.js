import axios from 'axios'
import { useEffect, useState } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import Loading from '../components/Spinners/Loading'

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatchGlobal();
  const { connector: activeConnector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [messageNonce, setMessageNonce] = useState(null);

  // Login Profile
  const loginProfile = (address, dispatch) => {
    return new Promise(async (resolve, reject) => {

      const res = await profileService.loginSQ(address)
        .catch((err) => {
          if (err && err.response && err.response.data && err.response.data.error) {
            console.error(err)
            return reject(false)
          }
        })

      const token = res.data.token;
      const profile = res.data.data;

      dispatch({
        type: 'AUTHPROFILE',
        payload: profile
      });

      const yubiaiLS = {
        token: token,
        wallet: profile.eth_address
      };

      Cookies.set('Yubiai', token, { expires: 1, secure: true })
      localStorage.setItem('Yubiai', JSON.stringify(yubiaiLS));
      return resolve();
    })
  }

  const { isLoading: loadingSignNonce, signMessageAsync } = useSignMessage({
    async onSuccess(data) {
      console.log('Success signMessageAsync', data)
      if (data && data.length >= 420) {
        await loginProfile(address, dispatch).catch((err) => {
          console.error(err);
          return;
        })

        dispatch({
          type: 'AUTHERROR',
          payload: null
        });
        dispatch({
          type: 'SET_LOGINRAINBOW',
          payload: 'authenticated',
        })
        return
      } else {
        // Metamask
        const verifyRes = await axios.post(`/auth/verifysignature`, {
          message: messageNonce, signature: data
        });

        if (verifyRes) {
          await loginProfile(messageNonce.address, dispatch);
        }

        dispatch({
          type: 'SET_LOGINRAINBOW',
          payload: 'authenticated',
        })

        return
      }
    },
    onError(error) {
      console.log('Error signMessageAsync', error)
      dispatch({
        type: 'SET_LOGINRAINBOW',
        payload: 'unauthenticated',
      })
      return router.push("/logout")
    },
  })

  const loginVerify = async () => {
    console.log("Empezo el login Verify")
    try {
      const nonceBack = await axios.get(`/auth/nonce`);
      console.log(nonceBack);

      console.log("create message")
      const formatMessage = {
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain && chain.id,
        nonce: nonceBack.data,
      }
      console.log(formatMessage, "formatMessage")
      const message = new SiweMessage(formatMessage);
      setMessageNonce(message);
      await signMessageAsync({
        message: message.prepareMessage(),
      })
      return
    } catch (err) {
      console.error(err);
      dispatch({
        type: 'SET_LOGINRAINBOW',
        payload: 'unauthenticated',
      })
      return router.push("/logout")
    }
  }

  useEffect(() => {
    console.log(isConnected, "isConnected");
    console.log(activeConnector, "activeConnector")

    if (isConnected == true && activeConnector) {

      console.log("Estoy loguedo")
      loginVerify();
    }
    return
  }, [isConnected])

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
          console.log("No token")
          throw "No Token"
        }

        const response = Yubiai
          ? await axios.get('/auth/session/', {
            headers: {
              Authorization: `Bearer ${Yubiai.token ? Yubiai.token : Ybcookies
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
          if (isConnected) {
            disconnect();
          }
          dispatch({
            type: 'SET_LOGINRAINBOW',
            payload: 'unauthenticated',
          })
          router.push('/logout')
          return
        }
      } catch (err) {
        console.error(err, "Not connected");
        if (isConnected) {
          disconnect();
        }
        return
      }
    }
    authToken()
  }, [dispatch]);

  if (loadingSignNonce) {
    return (
      <>
        <Loading styleType={'checkout'} />
        {children}
      </>
    )
  }

  return <>{children}</>
}

export default AuthProvider
