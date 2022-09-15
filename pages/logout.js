import { Box, Heading, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatchGlobal } from '../providers/globalProvider'
import Cookies from 'js-cookie'

const Logout = () => {
  const dispatch = useDispatchGlobal()
  const router = useRouter()

  useEffect(() => {
    const LoadingLogout = () => {
      dispatch({
        type: 'AUTHPROFILE',
        payload: null,
      })
      localStorage.removeItem('Yubiai')
      Cookies.remove('Yubiai')
      setTimeout(() => {
        router.back()
      }, 1000)
    }
    LoadingLogout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box textAlign="center" py={10} px={6} h={{base: '100vh', sm: '100vh', md: "80vh"}}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Loading Logout...
      </Heading>
    </Box>
  )
}

export default Logout
