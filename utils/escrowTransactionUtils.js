const ordersToTransactionData = (order, recipient, timeout) => {
    /*
    const totalAmount = order.orders.reduce(
        (currentVal, prevAmount) => (prevAmount + currentVal.amount), 0)
    */
    const generatedDescription = order.orders.map(order => order.name).join(',');

    return {
        title: `Order nr. ${order.name}`,
        description: generatedDescription,
        fileURI: { contract: `Generated order #${order.name}` },
        amount: {
            value: 1e16,
            currency: 'UBI'
        },
        recipient,
        timeout
    };
}

/**
 * Methods to load dummy data
 */

const loadDummyData = () => ({
    orderInfo: loadDummyOrders(),
    recipient: '0x4b93A94ca58594FAF5f64948A26F3E195Eb63B6E',
    timeout: 604800
})

const loadDummyOrders = () => ({
    name: 199382,
    orders: [
        {
            id: 1,
            name: 'Camera Nikon 371',
            value: 0
        },
        {
            id: 2,
            name: 'LED lights 332 x12',
            value: 0
        },
        {
            id: 3,
            name: 'Tripod EE920 16x30x12',
            value: 0
        }
    ]
})

export {
    ordersToTransactionData,
    loadDummyData
}