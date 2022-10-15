const DEFAULT_TIMEOUT = 604800;

const translateStatusIdToNamingInTransaction = (statusId = 0) => {
    const WAITING_STATUS = 0;
    const APPEALABLE_STATUS = 1;
    const SOLVED_STATUS = 2;

    switch (statusId) {
        case APPEALABLE_STATUS:
            return 'ORDER_DISPUTE_APPEALABLE';
        case SOLVED_STATUS:
            return 'ORDER_DISPUTE_FINISHED';
        case WAITING_STATUS:
        default:
            return 'ORDER_DISPUTE_IN_PROGRESS';
    }
}

const getProtocolNamingFromNetwork = (network) => {
    const capitalNameNetwork = network.charAt(0).toUpperCase() + network.slice(1);
    return network !== 'Main' ? `${capitalNameNetwork} ERC20` : 'ERC20';
}

const parsePriceToETHAmount = (priceInUSD, ethData, web3Instance) => {
    const { price } = ethData || { price: 1 };
    const rateValue = (priceInUSD / price);
    return web3Instance.utils.toWei(rateValue.toString())
}

const parseFromAToBToken = (basePrice, tokenA, tokenB) => {
    const priceA = tokenA?.price;
    const priceB = tokenB?.price;

    const rateValue = (basePrice * priceA) / priceB;
    return rateValue
}

const totalAmountOrder = (orders = []) => {
    return orders.reduce(
        (currentVal, prevOrder) => currentVal + prevOrder.price, 0) || 0;
};

const parseItemIntoOrderTransaction = (
    item = {},
    recipient,
    currencyContract='',
    timeout=DEFAULT_TIMEOUT
) => {
    const generatedDescription = item.title
    const compiledItemIds = item._id

    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate() + 1
    const date = `${now.getFullYear()}-${month < 10 ? `0${month}` : month }-${day < 10 ? `0${day}` : day }`

    const generatedTitle = `Order for item: ${compiledItemIds}, Date ${date}`

    const totalOrderValue = item.price

    return {
        orderInfo: {
            item
        },
        transaction: {
            title: generatedTitle,
            description: generatedDescription,
            extraData: {
                'Contract information': generatedTitle
            },
            amount: {
                value: totalOrderValue,
                currency: currencyContract
            },
            recipient: recipient.toLowerCase(),
            timeout
        }
    }
}

export {
    parseItemIntoOrderTransaction,
    totalAmountOrder,
    parsePriceToETHAmount,
    getProtocolNamingFromNetwork,
    parseFromAToBToken,
    translateStatusIdToNamingInTransaction
}