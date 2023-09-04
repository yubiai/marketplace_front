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
import { gnosis, goerli } from 'wagmi/chains';
import { infuraProvider } from '@wagmi/core/providers/infura'

import { publicProvider } from 'wagmi/providers/public';
import { useState } from 'react';
import { useRouter } from 'next/router';



const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    goerli
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
        defaultNetwork: 1,
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
  const router = useRouter();

  const [authenticationStatus, setAuthenticationStatus] = useState("");
  const authenticationAdapter = createAuthenticationAdapter({

    getNonce: async () => {
      console.log("arranco get nonce")
      const response = await axios.get(`/auth/nonce`);
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
          const verifyRes = await axios.post(`/auth/verifysignature`, {
            message, signature
          });
          console.log(verifyRes, "verifyRes")
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
