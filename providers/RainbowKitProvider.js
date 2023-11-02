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
import { goerli, mainnet } from 'wagmi/chains';
import { gnosis } from '@wagmi/core/chains';
import { infuraProvider } from '@wagmi/core/providers/infura'

import { publicProvider } from 'wagmi/providers/public';
import { useRouter } from 'next/router';

/* const GnosisChain = {
  id: 100,
  name: 'Gnosis Chain',
  network: 'Gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'xDai',
    symbol: 'xDai',
  },
  rpcUrls: {
    default: 'wss://gnosis.publicnode.com',
  },
  blockExplorers: {
    default: { name: 'Gnosis Scan', url: 'https://gnosisscan.io/' },
  },
  iconUrls: ["https://images.prismic.io/koinly-marketing/16d1deb7-e71f-48a5-9ee7-83eb0f7038e4_Gnosis+Chain+Logo.png"],
  testnet: false,
} */

const { chains, publicClient, webSocketPublicClient } = configureChains( process.env.NEXT_PUBLIC_ENV == "prod" ? [{ ...gnosis, iconUrl: '/chains/gnosis.svg' }] : [goerli, mainnet],
  [ 
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_ENV == "prod" ? process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GNOSIS : process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GOERLI }),
    publicProvider()
  ],
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
