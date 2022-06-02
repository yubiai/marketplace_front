import {
    Box,
    Container,
    Text,
    Flex,
    Image,
    Heading,
  } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import ButtonCheckout from '../../components/Buttons/ButtonCheckout'
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider'
import {
    loadCurrencyPrices,
    loadOrderData,
    setKlerosInstance
} from '../../providers/orderProvider'
import { orderService } from '../../services/orderService'
import { totalAmountOrder } from '../../utils/orderUtils'

const Checkout = () => {
    const global = useGlobal()
    const dispatch = useDispatchGlobal()
    const router = useRouter()
    const [orderData, setOrderData] = useState({});
    const [transactionData, setTransactionData] = useState({});

    useEffect(() => {
        const loadOrder = async () => {
            const result = await loadOrderData(
                [...global.itemsToCheckout], global.currencyPriceList)
            const { orderInfo, transaction } = result
            setOrderData(orderInfo)
            setTransactionData(transaction)
        }

        if (!global.currencyPriceList.length) {
            loadCurrencyPrices(dispatch)
            return;
        }

        if (!global.itemsToCheckout.length) {
            return;
        }

        if (!transactionData.fileURI) {
            loadOrder()
        } else {
            if (!global.klerosEscrowInstance) {
                setKlerosInstance({...transactionData}, dispatch)
            }
            return;
        }
    }, [transactionData, global.itemsToCheckout, global.currencyPriceList])

    const createOrder = async (transactionResult = {}) => {
        const currentWalletAccount = await global.klerosEscrowInstance.getAccount()
        await orderService.createOrder({
            order: {
                items: [...orderData.orders],
                userBuyer: currentWalletAccount,
                status: 'ORDER_CREATED'
            },
            transactionInfo: transactionResult
        });
        router.push(`/profile/orders/detail/${transactionResult.transactionHash}`)
    }

    return transactionData && (
        <Container padding={'2rem 0'} height={'calc(100vh - 180px)'}>
            <Heading>Order summary</Heading>
            <Flex padding={'1rem 0'} flexDirection='column'>
                {
                    orderData.orders && orderData.orders.length && 
                    orderData.orders.map((orderItem, orderIndex) => (
                        <Flex key={`order-item-${orderIndex}`} margin='1.25rem 0'>
                            <Image objectFit={'cover'}
                                    maxWidth='120px'
                                    marginRight='1rem'
                                    src={orderItem.pictures[0]}/>
                            <Box>
                                <Text fontWeight='bold' fontSize='18px'>{orderItem.title}</Text>
                                <Text fontSize='14px'>Price: {orderItem.price}{orderItem.currencySymbolPrice}</Text>
                            </Box>
                        </Flex>
                    ))
                }
            </Flex>
            <Box borderTop='1.5px solid #212121'>
                <Text><span style={{fontSize: '18px'}}>Total:</span> ${totalAmountOrder(orderData.orders)}</Text>
            </Box>
            <Flex>
                <ButtonCheckout style={{display: 'block', margin: '1rem auto'}}
                                transactionInfo={transactionData}
                                createOrder={createOrder} />
            </Flex>
        </Container>
    );
}

export default Checkout