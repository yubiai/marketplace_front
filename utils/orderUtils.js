const DEFAULT_TIMEOUT = 604800;

const getProtocolNamingFromNetwork = () => {
    const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';
    return network === 'kovan' ? 'Kovan ERC20' : 'ERC20';
}

const parsePriceToETHAmount = (priceInUSD, ethData, web3Instance) => {
    const { price } = ethData || { price: 1 };
    const rateValue = (priceInUSD / price);
    return web3Instance.utils.toWei(rateValue.toString())
}

const parseFromAToBToken = (basePrice, tokenA, tokenB) => {
    const priceA = tokenA.price;
    const priceB = tokenB.price;

    const rateValue = (basePrice * priceB) / priceA;
    return rateValue
}

const totalAmountOrder = (orders = []) => {
    return orders.reduce(
        (currentVal, prevOrder) => currentVal + prevOrder.price, 0) || 0;
};

const parseItemIntoOrderTransaction = (
    items = [],
    recipient,
    currencyContract='',
    timeout=DEFAULT_TIMEOUT
) => {
    const generatedDescription = items.map(item => item.title).join(',')
    const compiledItemIds = items.map(item => item._id).join(',#')

    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate() + 1
    const date = `${now.getFullYear()}-${month < 10 ? `0${month}` : month }-${day < 10 ? `0${day}` : day }`

    const generatedTitle = `Order for items: ${compiledItemIds}, Date ${date}`

    const totalOrderValue = totalAmountOrder(items)

    return {
        orderInfo: {
            orders: [...items]
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
    parseFromAToBToken
}