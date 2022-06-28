const getCurrentWallet = (lowerCase=false) => {
    const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'));
    const { wallet } = yubiaiLS || { wallet: ''};
    return lowerCase ? wallet.toLowerCase() : wallet;
}

export {
    getCurrentWallet
}