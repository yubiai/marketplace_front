// Rainbow-me
import '@0xsequence/design-system/styles.css'

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

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { gnosis, goerli, mainnet } from 'wagmi/chains';
import { infuraProvider } from '@wagmi/core/providers/infura'

import { publicProvider } from 'wagmi/providers/public';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { profileService } from '../services/profileService';

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
  const router = useRouter()

  const authenticationAdapter = createAuthenticationAdapter({

    signOut: async () => {
      console.log("arranco signout")
      router.replace('/logout')
      return;
    }
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={global.loginRainbow}>
        <RainbowKitProvider modalSize="compact" appInfo={demoAppInfo} chains={chains}>
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default RainbowKitWrapper;
