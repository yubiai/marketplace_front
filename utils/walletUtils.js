const listChains = [
  {
    id: 1,
    chainID: "0x1",
    title: "Ethereum",
    aliasTitle: 'mainnet',
    currency: "ETH"
  },
  {
    id: 5,
    chainID: "0x5",
    title: "Görli",
    aliasTitle: 'goerli',
    currency: "ETH"
  },
  {
    id: 100,
    chainID: "0x64",
    title: "Gnosis",
    aliasTitle: 'gnosis',
    currency: "xDAI"
  },
  {
    id: 38,
    chainID: "0x38",
    title: "BSC Mainnet",
    aliasTitle: 'bsc',
    currency: "BNB",
    rpcUrls: ['https://bsc-dataseed.binance.org/']
  }
];

const getCurrentNetwork = () => {
  const getNetwork = (id) => listChains.find(chain => chain.id === id);

  if (typeof window === "undefined") {
    return;
  }

  if (window && window.ethereum && window.ethereum.networkVersion) {
    const networkVersion = window.ethereum.networkVersion;
    console.log(networkVersion)
    const data = getNetwork(parseInt(networkVersion, 10));
    return data;
  }
  return;
}

const getCurrentWallet = (lowerCase = false) => {
  const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'));
  const { wallet } = yubiaiLS || { wallet: '' };
  return lowerCase ? wallet.toLowerCase() : wallet;
}

const getBlockExplorerForNetwork = (networkType) => {
  switch (networkType) {
    case 'goerli':
      return 'https://goerli.etherscan.io';
    case 'mainnet':
      return 'https://etherscan.io';
    case 'kovan':
      return 'https://kovan.etherscan.io';
    case 'chiado':
      return 'https://blockscout.chiadochain.net';
    case 'gnosis':
      return 'https://blockscout.com';
    case 'bsc':
      return 'https://bscscan.com';
    default:
      return '';
  }
}

const getContractsForNetwork = (networkType) => {
  switch (networkType) {
    case 'goerli':
      return {
        yubiaiArbitrable: process.env.NEXT_PUBLIC_GOERLI_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
        yubiaiArbitrator: process.env.NEXT_PUBLIC_GOERLI_ARBITRATOR
      };
    case 'mainnet':
      return {
        yubiaiArbitrable: process.env.NEXT_PUBLIC_MAIN_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
        yubiaiArbitrator: process.env.NEXT_PUBLIC_MAIN_ARBITRATOR
      };
    case 'rinkeby':
    case 'ropsten':
    case 'kovan':
    case 'private':
    default:
      return {
        yubiaiArbitrable: '',
        yubiaiArbitrator: ''
      };
  }
}

export {
  getCurrentWallet,
  getContractsForNetwork,
  listChains,
  getBlockExplorerForNetwork,
  getCurrentNetwork,
}