import { useEffect } from 'react'
import { profileService } from '../services/profileService'
import { useDispatchGlobal } from './globalProvider'

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatchGlobal()

  useEffect(() => {
    return async () => {
      console.log('Verificacion AUTH')
      const dataToken = await profileService.getCurrentUser()
      if (dataToken && dataToken.walletAddress) {
        const result = await profileService.login(dataToken.walletAddress)
        dispatch({
          type: 'AUTHPROFILE',
          payload: result.data.data,
        })
        localStorage.setItem('YBI-token', result.data.token)
      }
    }
  }, [dispatch])
  return <>{children}</>
}

export default AuthProvider
