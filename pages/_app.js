
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

import dynamic from 'next/dynamic'

const RainbowKitWrapper = dynamic(() => import('../providers/RainbowKitProvider'), {
  ssr: false
})

import '../styles/globals.css'
import '../styles/lexical.css'
import Footer from '../components/Layouts/Footer'
import Header from '../components/Layouts/Header'
import Navbar from '../components/Layouts/Navbar'

import Axios from 'axios'
import { GlobalProvider } from '../providers/globalProvider'
import { AuthProvider } from '../providers/authProvider'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { SWRConfig } from 'swr'
import TourGuideProvider from '../providers/tourProvider';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL
//Axios.defaults.withCredentials = true;

// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';


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
    <GlobalProvider>
      <RainbowKitWrapper>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />

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
                <Component {...pageProps} />
                <Footer />
              </TourGuideProvider>
            </AuthProvider>
          </SWRConfig>
        </ChakraProvider>
      </RainbowKitWrapper>
    </GlobalProvider>
  )
}

export default MyApp
