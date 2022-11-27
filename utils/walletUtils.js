const getCurrentWallet = (lowerCase=false) => {
    const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'));
    const { wallet } = yubiaiLS || { wallet: ''};
    return lowerCase ? wallet.toLowerCase() : wallet;
}

const getContractsForNetwork = (networkType) => {
    switch (networkType) {
        case 'goerli':
            return {
                yubiaiArbitrable: process.env.NEXT_PUBLIC_GOERLI_YUBIAI_ARBITRABLE_PAYMENT_CONTRACT,
                yubiaiArbitrator: process.env.NEXT_PUBLIC_GOERLI_ARBITRATOR
            };
        case 'main':
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
    getContractsForNetwork
}