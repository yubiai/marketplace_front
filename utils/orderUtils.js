const DEFAULT_TIMEOUT = 604800;

const parseItemIntoOrderTransaction = (items = [], recipient, timeout=DEFAULT_TIMEOUT) => {
    const generatedDescription = items.map(item => item.title).join(',')
    const compiledItemIds = items.map(item => item._id).join(',#')
    const date = Date.now()
    const generatedTitle = `Order for items: ${compiledItemIds}, Date ${date}`

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
                value: 1e16,
                currency: 'UBI'
            },
            recipient,
            timeout
        }
    }
}

export {
    parseItemIntoOrderTransaction
}