import axios from 'axios'
import { useEffect, useState } from 'react'
import { profileService } from '../services/profileService'
import { loginMetamask } from '../utils/ethereum'
import { useDispatchGlobal, useGlobal } from './globalProvider'
import Cookies from 'js-cookie'
import { notiService } from '../services/notiService'
import { useRouter } from 'next/router'

export const AuthProvider = ({ children }) => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const [check, setCheck] = useState(0)

  // Pedir notifications
  const callApiNoti = async (userId, token) => {
    console.log("se activo pasaron lkos 40seg")
    await notiService
      .getNotiFalseByUserId(userId, token)
      .then((res) => {
        dispatch({
          type: 'SET_NOTIFICATIONS',
          payload: res.data
        })
        return
      })
      .catch((err) => {
        console.log(err)
        return
      })
  }

  // Empieza cada tanto tiempo a preguntar si hay nuevas notifications
  useEffect(() => {
    if(global.profile && global.profile._id && global.profile.token){
      const id = setInterval(() => {
        callApiNoti(global.profile._id, global.profile.token)
        setCheck(check + 1)
      }, 40000)
      return () => clearInterval(id) 
    }
  }, [check, global.profile])

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
                Authorization: `Bearer ${
                  Yubiai.token ? Yubiai.token : Ybcookies
                }`,
              },
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
          callApiNoti(user.data._id, Yubiai.token);
          return
        } else {
          dispatch({
            type: 'AUTHPROFILE',
            payload: null,
          })
          router.push("/")
          return
        }
      } catch (err) {
        dispatch({
          type: 'AUTHPROFILE',
          payload: null,
        })
        localStorage.removeItem('Yubiai')
        router.push("/")
        return
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
