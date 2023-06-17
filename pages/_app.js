
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import Footer from '../components/Layouts/Footer'
import Header from '../components/Layouts/Header'
import Navbar from '../components/Layouts/Navbar'

import Axios from 'axios'
import MetaAlert from '../components/Alerts/metaAlert'
import { GlobalProvider } from '../providers/globalProvider'
import { AuthProvider } from '../providers/authProvider'

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { SWRConfig } from 'swr';
import TourGuideProvider from '../providers/tourProvider';
import MetaErrorAlert from '../components/Alerts/metaErrorAlert';
import { SiweMessage } from 'siwe';

// Rainbow-me
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  connectorsForWallets,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { sequenceWallet } from '@0xsequence/rainbowkit-plugin'

import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { goerli, gnosis } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import axios from 'axios';
import { useState } from 'react';


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    gnosis,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli, sepolia] : []),
  ],
  [publicProvider()]
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
      sequenceWallet({
        chains,
        connect: {
          app: projectId,
          networkId: 100,
          authorize: true
        }
      })
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


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

  const [authenticationStatus, setAuthenticationStatus] = useState("");
  const authenticationAdapter = createAuthenticationAdapter({

    getNonce: async () => {
      console.log("Get Nonce")
      const response = await axios.get(`/auth/nonce`);
      console.log(response.data, "response.text()")
      return await response.data;
    },

    createMessage: ({ nonce, address, chainId }) => {
      try {
        const formatMessage = {
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        }
        const message = new SiweMessage(formatMessage);

        return message;
      } catch (err) {
        console.error(err);
        return
      }
    },

    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
      try {

        // Sequence
        if (signature && signature.length >= 420) {
          setAuthenticationStatus("authenticated");
          return Boolean(true);
        } else {
          // Metamask
          console.log(signature, "signature")
          const verifyRes = await axios.post(`/auth/verifysignature`, {
            message, signature
          });
          console.log(verifyRes, "verifyRes")

          setAuthenticationStatus(verifyRes.data == true ? "authenticated" : "unauthenticated");
          return Boolean(true);
        }

      } catch (err) {
        console.error(err);
        return Boolean(false);
      }
    },

    signOut: async () => {
      console.log("arranco signout")
      setAuthenticationStatus("unauthenticated");
    },
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={authenticationStatus}>
        <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
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
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  )
}

export default MyApp
