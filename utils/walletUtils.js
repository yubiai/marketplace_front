const listChains = process.env.NEXT_PUBLIC_ENV === "prod" ? [{
  id: 100,
  chainID: "0x64",
  title: "Gnosis",
  aliasTitle: 'gnosis',
  currency: "xDAI",
  rpcUrls: ['https://rpc.gnosischain.com']
}
] : [
  /*   {
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
      id: 56,
      chainID: "0x38",
      title: "BSC Mainnet",
      aliasTitle: 'bsc',
      currency: "BNB",
      rpcUrls: ['https://bsc-dataseed.binance.org/']
    }, 
  {
    id: 100,
    chainID: "0x64",
    title: "Gnosis",
    aliasTitle: 'gnosis',
    currency: "xDAI",
    rpcUrls: ['https://rpc.gnosischain.com']
  },*/
  {
    id: 11155111,
    chainID: "0xaa36a7",
    title: "Sepolia",
    aliasTitle: 'sepolia',
    currency: "SEP",
    rpcUrls: ['https://rpc2.sepolia.org/']
  }
];

const getCurrentNetwork = () => {
  const getNetwork = (id) => listChains.find(chain => chain.id === id);

  if (typeof window === "undefined") {
    return;
  }

  if (window && window.ethereum && window.ethereum.networkVersion) {
    const networkVersion = window.ethereum.networkVersion;
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
      return {
        blockExplorer: 'https://goerli.etherscan.io',
        token_address: '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D'
      }
    case 'mainnet':
      return 'https://etherscan.io';
    case 'kovan':
      return 'https://kovan.etherscan.io';
    case 'chiado':
      return 'https://blockscout.chiadochain.net';
    case 'gnosis':
      return {
        blockExplorer: 'https://gnosisscan.io',
        token_address: '0x6810e776880c02933d47db1b9fc05908e5386b96'
      }
    case 'bsc':
      return 'https://bscscan.com';
    case 'sepolia':
      return 'https://sepolia.etherscan.io'
    default:
      return '';
  }
}

/**
 * TODO: Refactorizar, juntando esta logica con orderProvider.getSettingsByNetwork
 */
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
    case 'sepolia':
      return {
        yubiaiArbitrable: process.env.NEXT_PUBLIC_SEPOLIA_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
        yubiaiArbitrator: process.env.NEXT_PUBLIC_SEPOLIA_ARBITRATOR
      }
    case 'gnosis':
      return {
        yubiaiArbitrable: process.env.NEXT_PUBLIC_GNOSIS_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
        yubiaiArbitrator: process.env.NEXT_PUBLIC_GNOSIS_ARBITRATOR
      }
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