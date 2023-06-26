


const lachain = {
    id: 418,
    name: 'LaTestnet',
    network: 'latestnet',
    nativeCurrency: {
        decimals: 0x418,
        name: 'LaTestnet',
        symbol: 'TLA',
    },
    rpcUrls: {
        public: { http: ['https://rpc.testnet.lachain.network/'] }
    },
    blockExplorers: {
        default: { name: 'LaTestnet', url: 'https://testexplorer.lachain.network/' },
    }
}

const sepolia = {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
        decimals: 0xaa36a7,
        name: 'Sepolia',
        symbol: 'SEP',
    },
    rpcUrls: {
        public: { http: ['https://rpc2.sepolia.org'] }
    },
    blockExplorers: {
        default: { name: 'Sepolia', url: 'https://sepolia.etherscan.io' },
    }

}

const polygon = {
    id: 137,
    name: 'Polygon',
    network: 'polygon',
    nativeCurrency: {
        decimals: 0x89,
        name: 'Polygon',
        symbol: 'MATIC',
    },
    rpcUrls: {
        public: { http: ['https://polygon.llamarpc.com'] }
    },
    blockExplorers: {
        default: { name: 'Polygon', url: 'https://polygonscan.com' },
    }

}


export {
    lachain,
    sepolia,
    polygon
}