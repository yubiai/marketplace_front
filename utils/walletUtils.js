const getCurrentWallet = (lowerCase=false) => {
    const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'));
    const { wallet } = yubiaiLS || { wallet: ''};
    return lowerCase ? wallet.toLowerCase() : wallet;
}

const getContractsForNetwork = (networkType) => {
    switch (networkType) {
        case 'goerli':
            return {
                paymentProcessor: process.env.NEXT_PUBLIC_GOERLI_PAYMENT_PROCESSOR_CONTRACT,
                yubiaiArbitrable: process.env.NEXT_PUBLIC_GOERLI_MULTPLE_ARBITRABLE_CONTRACT
            };
        case 'main':
            return {
                paymentProcessor: process.env.NEXT_PUBLIC_MAIN_PAYMENT_PROCESSOR_CONTRACT,
                yubiaiArbitrable: process.env.NEXT_PUBLIC_MAIN_MULTPLE_ARBITRABLE_CONTRACT
            };
        case 'rinkeby':
        case 'ropsten':
        case 'kovan':
        case 'private':
        default:
            return {
                paymentProcessor: '',
                yubiaiArbitrable: ''
            };
    }
}

export {
    getCurrentWallet,
    getContractsForNetwork
}