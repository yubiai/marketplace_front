const listChains = process.env.NEXT_PUBLIC_ENV === "prod" ? [{
  id: 100,
  chainID: "0x64",
  title: "Gnosis",
  aliasTitle: 'gnosis',
  currency: "xDAI",
  rpcUrls: ['https://rpc.gnosischain.com']
}
] : [
  {
    id: 5,
    chainID: "0x5",
    title: "Görli",
    aliasTitle: 'goerli',
    currency: "ETH"
  },
  {
    id: 137,
    chainID: "0x89",
    title: "Polygon",
    aliasTitle: 'polygon',
    currency: "MATIC",
    rpcUrls: ['https://polygon-bor.publicnode.com']
  },
  /*   {
      id: 1,
      chainID: "0x1",
      title: "Ethereum",
      aliasTitle: 'mainnet',
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
  },
  {
    id: 11155111,
    chainID: "0xaa36a7",
    title: "Sepolia",
    aliasTitle: 'sepolia',
    currency: "SEP",
    rpcUrls: ['https://rpc2.sepolia.org/']
  },
  {
    id: 80001,
    chainID: "0x13881",
    title: "Matic",
    aliasTitle: 'matic',
    currency: "TST",
    rpcUrls: ['https://rpc2.sepolia.org/']
  }*/
];

const getCurrentNetwork = () => {
  const getNetwork = (id) => listChains.find(chain => chain.id === id);

  if (typeof window === "undefined") {
    return;
  }

  if (window && window.ethereum && window.ethereum.networkVersion) {
    const networkVersion = window.ethereum.networkVersion;
    console.log(networkVersion, "networkVersion")
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
      return 'https://gnosisscan.io/';
    case 'bsc':
      return 'https://bscscan.com';
    case 'sepolia':
      return 'https://sepolia.etherscan.io'
    case 'mumbai':
      return 'https://mumbai.polygonscan.com'
    default:
      return '';
  }
}

/**
 * TODO: Refactorizar, juntando esta logica con orderProvider.getSettingsByNetwork
 */
const getContractsForNetwork = (networkType) => {
  console.log(networkType, "networkType contract for network")
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
    case 'polygon':
      return {
        yubiaiArbitrable: process.env.NEXT_PUBLIC_POLYGON_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
        yubiaiArbitrator: process.env.NEXT_PUBLIC_POLYGON_ARBITRATOR
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