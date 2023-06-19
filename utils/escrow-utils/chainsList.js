


const lachain = {
    id: 274,
    name: 'LaChain',
    network: 'lachain',
    nativeCurrency: {
        decimals: 0x274,
        name: 'LaChain',
        symbol: 'LAC',
    },
    rpcUrls: {
        public: { http: ['https://rpc1.mainnet.lachain.network/'] },
        default: { http: ['https://rpc2.mainnet.lachain.network/'] },
    },
    blockExplorers: {
        default: { name: 'LaChain', url: 'https://explorer.lachain.network/' },
    }
}


export {
    lachain
}