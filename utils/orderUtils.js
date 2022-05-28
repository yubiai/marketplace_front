const DEFAULT_TIMEOUT = 604800;

const parsePriceToETHAmount = (priceInUSD, ethData, web3Instance) => {
    const { price } = ethData || { price: 1 };
    const rateValue = (priceInUSD / price);
    return web3Instance.utils.toWei(rateValue.toString())
}

const totalAmountOrder = (orders) => {
    return orders.reduce(
        (currentVal, prevOrder) => currentVal + prevOrder.price, 0) || 0;
};

const parseItemIntoOrderTransaction = (
    items = [],
    recipient,
    currencyValues=[],
    web3Instance,
    timeout=DEFAULT_TIMEOUT
) => {
    const generatedDescription = items.map(item => item.title).join(',')
    const compiledItemIds = items.map(item => item._id).join(',#')
    const date = Date.now()
    const generatedTitle = `Order for items: ${compiledItemIds}, Date ${date}`

    const totalOrderValue = totalAmountOrder(items)
    const ethObj = currencyValues.find(currency => currency.symbol === 'ETH')
    const priceInETH = parsePriceToETHAmount(totalOrderValue, ethObj, web3Instance)

    return {
        orderInfo: {
            orders: [...items]
        },
        transaction: {
            title: generatedTitle,
            description: generatedDescription,
            fileURI: {
                contract: generatedTitle
            },
            amount: {
                value: priceInETH,
                currency: 'ETH'
            },
            recipient,
            timeout
        }
    }
}

export {
    parseItemIntoOrderTransaction,
    totalAmountOrder,
    parsePriceToETHAmount
}