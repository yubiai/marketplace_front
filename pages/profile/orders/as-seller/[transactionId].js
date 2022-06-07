import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import { useGlobal, useDispatchGlobal } from '../../../../providers/globalProvider'
import {
    loadCurrencyPrices,
    loadOrderData,
    setKlerosInstance,
} from '../../../../providers/orderProvider'
import ButtonEscrowDispute from '../../../../components/Buttons/ButtonEscrowDispute'
import Loading from '../../../../components/Spinners/Loading'

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
    const [operationInProgress, setOperationInProgress] = useState(false)

    const redirectIfCurrentWalletIsNotSeller = (order, wallet) => {
        if (wallet === order.userBuyer) {
            router.push('/');
            return true;
        }
        return false;
    }

    const loadOrder = async () => {
        const response = await orderService.getOrderByTransaction(transactionId)
        const { data } = response;
        const orderInfo = data.result;

        const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'));
        const { wallet } = yubiaiLS;

        if (redirectIfCurrentWalletIsNotSeller(orderInfo, wallet)) {
            return;
        }

        const { transaction } = await loadOrderData(
            orderInfo.items, global.currencyPriceList, true);

        setOrderDetail(orderInfo)
        setTransactionData(transaction)
    }

    const toggleLoadingStatus = (status) => {
        setOperationInProgress(status);
    }

    useEffect(() => {
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
        <Container padding='2rem 0' height={'calc(100vh - 180px)'} position={'relative'}>
            {
                operationInProgress && 
                <Loading styleType={'checkout'} />
            }
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
                (orderDetail.transaction || {}).transactionIndex && orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
                    <Flex marginTop='auto' justifyContent='space-around'>
                        <ButtonEscrowDispute transactionIndex={(orderDetail.transaction || {}).transactionIndex}
                                             transactionHash={(orderDetail.transaction || {}).transactionHash}
                                             amount={minimumArbitrationFeeUSD}
                                             asSeller={true}
                                             stepsPostAction={loadOrder}
                                             toggleLoadingStatus={toggleLoadingStatus} />
                    </Flex>
                )
            }
            {
                (orderDetail.transaction || {}).transactionIndex && orderDetail.status === 'ORDER_DISPUTE_IN_PROGRESS' && 
                <p>Dispute in progress</p>
            }
        </Container>
    )
}

export default OrderDetail;