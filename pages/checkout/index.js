import {
    Box,
    Container,
    Text,
    Flex,
    Heading,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ButtonCheckout from '../../components/Buttons/ButtonCheckout'
import { useGlobal } from '../../providers/globalProvider'
import KlerosEscrowProvider from '../../providers/klerosEscrowProvider'
import { orderService } from '../../services/orderService'
import {
    parseItemIntoOrderTransaction
} from '../../utils/orderUtils'

const Checkout = () => {
    // Global
    const global = useGlobal()
    const DEFAULT_DUMMY_AMOUNT = 1000;
    const [orderData, setOrderData] = useState({ orders: [] });
    const [transactionData, setTransactionData] = useState({});

    useEffect(() => {
        const loadOrderData = async () => {
            const items = global.itemsToCheckout
            const seller = items[0].seller;

            const { eth_address } = seller
            const result = parseItemIntoOrderTransaction(
                global.itemsToCheckout, eth_address)
            const { orderInfo, transaction } = result

            setOrderData(orderInfo)
            setTransactionData(transaction)
        }

        if (!global.itemsToCheckout.length || orderData.orders.length) {
            return;
        }
        loadOrderData()
    }, [orderData]);

    const _totalAmountOrder = (orders) => {
        return orders.reduce(
            (currentVal, prevOrder) => currentVal + prevOrder.price, 0) || DEFAULT_DUMMY_AMOUNT;
    };

    const createOrder = async (transactionResult = {}) => {
        const currentWalletAccount = await global.klerosEscrowInstance.getAccount()
        await orderService.createOrder({
            order: {
                items: [...orderData.orders],
                userBuyer: currentWalletAccount
            },
            transactionInfo: transactionResult
        });
    }

    return (
        <KlerosEscrowProvider transactionData>
          <Container padding={'2rem 0'} height={'calc(100vh - 180px)'}>
              <Heading>Order summary</Heading>
              <Flex padding={'1rem 0'} flexDirection='column'>
                  {
                      orderData.orders.map((orderItem, orderIndex) => (
                          <Box key={`order-item-${orderIndex}`} margin='1.25rem 0'>
                              <Text fontWeight='bold' fontSize='18px'>{orderItem.title}</Text>
                              <Text fontSize='14px'>Price: ${orderItem.price}</Text>
                          </Box>
                      ))
                  }
              </Flex>
              <Box borderTop='1.5px solid #212121'>
                  <Text><span style={{fontSize: '18px'}}>Total:</span> ${_totalAmountOrder(orderData.orders)}</Text>
              </Box>
              <Flex>
                  <ButtonCheckout style={{display: 'block', margin: '1rem auto'}}
                                  transactionInfo={transactionData}
                                  createOrder={createOrder} />
              </Flex>
          </Container>
        </KlerosEscrowProvider>
      )
}

export default Checkout