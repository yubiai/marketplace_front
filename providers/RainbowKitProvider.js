// Rainbow-me
import '@0xsequence/design-system/styles.css'

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

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { gnosis, goerli } from 'wagmi/chains';
import { infuraProvider } from '@wagmi/core/providers/infura'

import { publicProvider } from 'wagmi/providers/public';

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
          app: 'My app'
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
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default RainbowKitWrapper;
