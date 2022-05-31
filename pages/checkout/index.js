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
import KlerosEscrowProvider from '../../providers/klerosEscrowProvider'
import { orderService } from '../../services/orderService'
import { priceService } from '../../services/priceService'
import {
    parseItemIntoOrderTransaction,
    totalAmountOrder,
    getProtocolNamingFromNetwork
} from '../../utils/orderUtils'

const Checkout = () => {
    // Global
    const global = useGlobal()
    const router = useRouter()
    const [orderData, setOrderData] = useState({ orders: [] });
    const [transactionData, setTransactionData] = useState({});
    const dispatch = useDispatchGlobal();

    useEffect(() => {
        const loadOrderData = async () => {
            if (!global.currencyPriceList.length) {
                return;
            }

            const items = global.itemsToCheckout
            const seller = items[0].seller;
            const itemCurrencySymbol = items[0].currencySymbolPrice || 'ETH';

            const { eth_address } = seller

            const currencyContract = global.currencyPriceList.find(
                currencyItem => currencyItem.symbol === itemCurrencySymbol).token_address;

            const result = parseItemIntoOrderTransaction(
                global.itemsToCheckout,
                eth_address,
                currencyContract
            )
            const { orderInfo, transaction } = result

            setOrderData(orderInfo)
            setTransactionData(transaction)
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

        if (
            !global.itemsToCheckout.length ||
            orderData.orders.length ||
            !global.klerosEscrowInstance
        ) {
            return;
        }
        loadCurrencyPrices()
        loadOrderData()
    }, [orderData, global.klerosEscrowInstance, global.currencyPriceList]);

    const createOrder = async (transactionResult = {}) => {
        const currentWalletAccount = await global.klerosEscrowInstance.getAccount()
        await orderService.createOrder({
            order: {
                items: [...orderData.orders],
                userBuyer: currentWalletAccount
            },
            transactionInfo: transactionResult
        });
        router.push(`/profile/orders/detail/${transactionResult.transactionHash}`)
    }

    return transactionData && (
        <KlerosEscrowProvider transactionData={{...transactionData}}>
            <Container padding={'2rem 0'} height={'calc(100vh - 180px)'}>
                <Heading>Order summary</Heading>
                <Flex padding={'1rem 0'} flexDirection='column'>
                    {
                        orderData.orders.map((orderItem, orderIndex) => (
                            <Flex key={`order-item-${orderIndex}`} margin='1.25rem 0'>
                                <Image objectFit={'cover'}
                                        maxWidth='120px'
                                        marginRight='1rem'
                                        src={orderItem.pictures[0]}/>
                                <Box>
                                    <Text fontWeight='bold' fontSize='18px'>{orderItem.title}</Text>
                                    <Text fontSize='14px'>Price: ${orderItem.price}</Text>
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
        </KlerosEscrowProvider>
    );
}

export default Checkout