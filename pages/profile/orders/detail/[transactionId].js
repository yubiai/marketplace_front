import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import { priceService } from '../../../../services/priceService'
import { useGlobal, useDispatchGlobal } from '../../../../providers/globalProvider'
import KlerosEscrowProvider from '../../../../providers/klerosEscrowProvider'
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder'
import ButtonStartEscrowDispute from '../../../../components/Buttons/ButtonStartEscrowDispute'
import {
    totalAmountOrder,
    getProtocolNamingFromNetwork,
    parseFromAToBToken,
} from '../../../../utils/orderUtils'
import {
    Box,
    Container,
    Text,
    Heading,
    Flex,
  } from '@chakra-ui/react'

const minimumArbitrationFeeUSD = 90;

const OrderDetail = () => {
    const router = useRouter()
    const global = useGlobal()
    const dispatch = useDispatchGlobal()
    const { transactionId } = router.query
    const [orderDetail, setOrderDetail] = useState({})
    const [transactionData, setTransactionData] = useState({})
    const [totalOrder, setTotalOrder] = useState(0)

    useEffect(() => {
        if (transactionData.fileURI) {
            return;
        }

        const loadOrderInfo = async () => {
            const response = await orderService.getOrderByTransaction(transactionId)
            const { data } = response;
            const orderInfo = data.result;

            const currencyItem = orderInfo.items[0].currencySymbolPrice;
            const currencyContract = global.currencyPriceList.find(
                currencyObject => currencyObject.symbol === currencyItem);
            const ethContract = global.currencyPriceList.find(
                currencyObject => currencyObject.symbol === 'ETH');

            const totalOrder = parseFromAToBToken(
                totalAmountOrder(orderInfo.items),
                currencyContract,
                ethContract
            )

            setTotalOrder(totalOrder)
            setOrderDetail(orderInfo)
            setTransactionData({
                amount: {
                    value: totalOrder,
                    currency: ethContract.token_address
                },
                fileURI: { contract: `Generated order #199382` }
            })
        }

        const loadCurrencyPrices = async () => {
            const naming = getProtocolNamingFromNetwork();
            const resp = await priceService.getCurrencyPrices(naming);
            const { data } = resp;
            dispatch({
                type: 'SET_CURRENCY_PRICE_LIST',
                payload: [...data],
            });
        }

        if (!global.currencyPriceList.length) {
            loadCurrencyPrices()
        }

        if (transactionId && global.currencyPriceList.length) {
            loadOrderInfo()
        }
    }, [transactionId, global.currencyPriceList, transactionData.fileURI])

    return (
        <KlerosEscrowProvider transactionData={{...transactionData}}>
            <Container padding='2rem 0' height={'calc(100vh - 180px)'}>
                <Heading marginBottom='2rem'>OrderDetail</Heading>
                <Box>
                    <Text marginBottom='1rem'>Order nro: {orderDetail._id}</Text>
                    <Box>
                        <Text marginBottom='1rem'>Items:</Text>
                        {
                            (orderDetail.items || []).map((item, index) => (
                                <Box padding='1rem' key={`order-item-${index}`}>
                                    <Text>{item.name}</Text>
                                    <Text>Price: {item.price || 0}{item.currencySymbolPrice || '$'}</Text>
                                </Box>
                            ))
                        }
                    </Box>
                    <Text marginBottom='1rem'>Transaction hash: {(orderDetail.transaction || {}).transactionHash}</Text>
                </Box>
                {
                    (orderDetail.transaction || {}).transactionIndex && (
                        <Flex marginTop='auto' justifyContent='space-around'>
                            <ButtonPayOrder transactionIndex={(orderDetail.transaction || {}).transactionIndex}
                                            amount={totalOrder} />
                            <ButtonStartEscrowDispute transactionIndex={(orderDetail.transaction || {}).transactionIndex}
                                                      amount={minimumArbitrationFeeUSD} />
                        </Flex>
                    )
                }
            </Container>
        </KlerosEscrowProvider>
    )
}

export default OrderDetail;