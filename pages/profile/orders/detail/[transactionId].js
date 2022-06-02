import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import { useGlobal, useDispatchGlobal } from '../../../../providers/globalProvider'
import {
    loadCurrencyPrices,
    loadOrderData,
    setKlerosInstance
} from '../../../../providers/orderProvider'
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder'
import ButtonStartEscrowDispute from '../../../../components/Buttons/ButtonStartEscrowDispute'

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

    useEffect(() => {
        const loadOrder = async () => {
            const response = await orderService.getOrderByTransaction(transactionId)
            const { data } = response;
            const orderInfo = data.result;

            const { transaction } = await loadOrderData(
                orderInfo.items, global.currencyPriceList, true);

            setOrderDetail(orderInfo)
            setTransactionData(transaction)
        }

        if (!transactionId) {
            return;
        }

        if (!global.currencyPriceList.length) {
            loadCurrencyPrices(dispatch)
            return;
        }

        if (!(transactionData || {}).fileURI) {
            loadOrder()
        } else {
            if (!global.klerosEscrowInstance) {
                setKlerosInstance({...transactionData}, dispatch)
            }
            return;
        }
    }, [transactionId, transactionData, global.currencyPriceList])
     

    return (
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
                        {
                            transactionData && transactionData.amount && 
                            <ButtonPayOrder transactionIndex={(orderDetail.transaction || {}).transactionIndex}
                                        amount={(transactionData.amount || {}).value || 0} />
                        }
                        <ButtonStartEscrowDispute transactionIndex={(orderDetail.transaction || {}).transactionIndex}
                                                    amount={minimumArbitrationFeeUSD} />
                    </Flex>
                )
            }
        </Container>
    )
}

export default OrderDetail;