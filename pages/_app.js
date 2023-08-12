
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

import '../styles/globals.css'
import '../styles/lexical.css'
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
import MetaErrorAlert from '../components/Alerts/metaErrorAlert';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL
//Axios.defaults.withCredentials = true;

// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygon,
  polygonMumbai,
  goerli,
  gnosis
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from '@wagmi/core/providers/infura'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENV === 'dev' ? [polygonMumbai, goerli, polygon] : [gnosis]),
  ],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA })],
  publicProvider()
);

const projectId = 'Yubiai';

const demoAppInfo = {
  appName: 'Yubiai',
};


const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      /* sequenceWallet({
        chains,
        connect: {
          app: projectId,
          networkId: 80001,
          authorize: true,
          askForEmail: true
        }
      }) */
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

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
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
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
                  <MetaErrorAlert />
                  <Component {...pageProps} />
                  <Footer />
                </TourGuideProvider>
              </AuthProvider>
            </SWRConfig>
          </GlobalProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
