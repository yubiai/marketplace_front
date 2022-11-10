export { reportWebVitals } from 'next-axiom';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

import '../styles/globals.css'
import Footer from '../components/Layouts/Footer'
import Header from '../components/Layouts/Header'
import Navbar from '../components/Layouts/Navbar'

import Axios from 'axios'
import MetaAlert from '../components/Alerts/metaAlert'
import { GlobalProvider } from '../providers/globalProvider'
import { AuthProvider } from '../providers/authProvider'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { SWRConfig } from 'swr'
import TourGuideProvider from '../providers/tourProvider';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL
//Axios.defaults.withCredentials = true;

const fetcher = async (url) => {
  try {
    const res = await Axios.get(url)
    return res.data
  } catch (err) {
    throw err.response
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      
      <GlobalProvider>
        <SWRConfig
          value={{
            fetcher,
            dedupingInterval: 10000
          }}
        >
          <AuthProvider>
            <TourGuideProvider>
              <Header />
              <Navbar />
              <MetaAlert />
              <Component {...pageProps} />
              <Footer />
            </TourGuideProvider>
          </AuthProvider>
        </SWRConfig>
      </GlobalProvider>
    </ChakraProvider>
  )
}

export default MyApp
