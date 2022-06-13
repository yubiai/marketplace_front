import axios from 'axios'
import { useEffect } from 'react'
import { useDispatchGlobal } from './globalProvider'

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    const authToken = async () => {
      console.log('Inicio de provider Auth')

      const YubiaiLs =
        typeof window !== 'undefined' ? localStorage.getItem('Yubiai') : null
      const Yubiai = YubiaiLs ? JSON.parse(YubiaiLs) : null

      const response = Yubiai
        ? await axios.get(
            `/profiles/session/${Yubiai && Yubiai.token ? Yubiai.token : null}`
          )
        : null

      const user =
        response && response.data && response.data.id
          ? await axios.get(`/profiles/id/${response.data.id}`)
          : null

      if (user && user.status === 200) {
        dispatch({
          type: 'AUTHPROFILE',
          payload: user.data,
        })
      }
    }
    authToken()
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider
