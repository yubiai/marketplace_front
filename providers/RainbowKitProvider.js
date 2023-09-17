// Rainbow-me
import '@0xsequence/design-system/styles.css'
import axios from 'axios'

import {
  RainbowKitProvider,
  connectorsForWallets,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { sequenceWallet } from '@0xsequence/rainbowkit-plugin'

import { SiweMessage } from 'siwe';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { gnosis, goerli, mainnet } from 'wagmi/chains';
import { infuraProvider } from '@wagmi/core/providers/infura'

import { publicProvider } from 'wagmi/providers/public';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { profileService } from '../services/profileService';
import { useDispatchGlobal } from './globalProvider';

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



const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    goerli, mainnet
  ],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GOERLI })],
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
      sequenceWallet({
        chains,
        defaultNetwork: 5,
        shimDisconnect: true,
        connect: {
          app: 'Yubiai'
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

function RainbowKitWrapper({ children }) {
  const dispatch = useDispatchGlobal();

  const [authenticationStatus, setAuthenticationStatus] = useState("");
  const authenticationAdapter = createAuthenticationAdapter({

    getNonce: async () => {
      console.log("arranco get nonce")
      const response = await axios.get(`/auth/nonce`);
      return await response.data;
    },

    createMessage: ({ nonce, address, chainId }) => {
      try {
        console.log("create message")
        const formatMessage = {
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        }
        console.log(formatMessage, "formatMessage")
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
        console.log(message, "message")
        console.log("Arranco")
        console.log(signature)
        // Sequence
        if (signature && signature.length >= 420) {
          await loginProfile(message.address, dispatch).catch((err) => {
            console.error(err);
            /* dispatch({
              type: 'AUTHERROR',
              payload: t('To connect it is necessary to be registered in Proof of Humanity and have your status as registered.')
            }); */
            return;
          })

          dispatch({
            type: 'AUTHERROR',
            payload: null
          });
          setAuthenticationStatus("authenticated");
          return Boolean(true);
        } else {
          // Metamask
          const verifyRes = await axios.post(`/auth/verifysignature`, {
            message, signature
          });

          await loginProfile(message.address, dispatch);
          setAuthenticationStatus(verifyRes.data == true ? "authenticated" : "unauthenticated");
          return Boolean(true);
        }

      } catch (err) {
        console.error(err);
        setAuthenticationStatus("unauthenticated")
        return Boolean(false);
      }
    },

    signOut: async () => {
      console.log("arranco signout")
      setAuthenticationStatus("unauthenticated");
      //router.replace('/logout')
    },
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={authenticationStatus}>
        <RainbowKitProvider modalSize="compact" appInfo={demoAppInfo} chains={chains}>
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default RainbowKitWrapper;
