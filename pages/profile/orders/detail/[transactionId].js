import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import KlerosEscrowProvider from '../../../../providers/klerosEscrowProvider'
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder'
import ButtonStartEscrowDispute from '../../../../components/Buttons/ButtonStartEscrowDispute'
import {
    Box,
    Container,
    Text,
    Heading,
    Flex,
  } from '@chakra-ui/react'

const OrderDetail = () => {
    const router = useRouter()
    const { transactionId } = router.query
    const [orderDetail, setOrderDetail] = useState({})
    const [transactionData, setTransactionData] = useState({})

    useEffect(() => {
        const loadOrderInfo = async () => {
            const response = await orderService.getOrderByTransaction(transactionId)
            const { data } = response;
            const orderInfo = data.result;
            setOrderDetail(orderInfo)
            setTransactionData({
                fileURI: { contract: `Generated order #199382` }
            })
        }
        if (transactionId) {
            loadOrderInfo()
        }
    }, [transactionId])

    return (
        <KlerosEscrowProvider transactionData={transactionData}>
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
                                    <Text>Price: ${item.price || 0}</Text>
                                </Box>
                            ))
                        }
                    </Box>
                    <Text marginBottom='1rem'>Transaction hash: {(orderDetail.transaction || {}).transactionHash}</Text>
                </Box>
                {
                    (orderDetail.transaction || {}).transactionIndex && (
                        <Flex marginTop='auto' justifyContent='space-around'>
                            <ButtonPayOrder transactionIndex={(orderDetail.transaction || {}).transactionIndex} />
                            <ButtonStartEscrowDispute transactionIndex={(orderDetail.transaction || {}).transactionIndex} />
                        </Flex>
                    )
                }
            </Container>
        </KlerosEscrowProvider>
    )
}

export default OrderDetail;