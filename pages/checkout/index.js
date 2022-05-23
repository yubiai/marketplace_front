import {
    Box,
    Container,
    Text,
    Flex,
    Heading,
    Divider
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ButtonCheckout from '../../components/Buttons/ButtonCheckout'
import {
    ordersToTransactionData,
    loadDummyData
} from '../../utils/escrowTransactionUtils'

const Checkout = () => {
    // Global
    /*
    const global = useGlobal()
    const router = useRouter()
    */

    const DEFAULT_DUMMY_AMOUNT = 1000;
    const [orderData, setOrderData] = useState({ orderInfo: { orders: [] } });
    const [transactionData, setTransactionData] = useState({});

    /**
     * Load data
     */
    useEffect(() => {
        const dummyData = loadDummyData();
        setOrderData(dummyData);
        if (dummyData.orderInfo.orders.length) {
            setTransactionData(
                ordersToTransactionData(orderData.orderInfo, orderData.recipient, orderData.timeout)
            );
        }
    }, []);

    const _totalAmountOrder = (orders) => {
        return orders.reduce(
            (currentVal, prevOrder) => currentVal + prevOrder.value, 0) || DEFAULT_DUMMY_AMOUNT;
    };

    return (
        <>
          <Container padding={'2rem 0'} height={'calc(100vh - 180px)'}>
              <Heading>Order summary</Heading>
              <Flex padding={'1rem 0'}>
                  {
                      orderData.orderInfo.orders.map((orderItem, orderIndex) => (
                          <Box key={`order-item-${orderIndex}`}>
                              <Text>{orderItem.name}</Text>
                          </Box>
                      ))
                  }
              </Flex>
              <Divider></Divider>
              <Box>
                  <Text>Total: ${_totalAmountOrder(orderData.orderInfo.orders)}</Text>
              </Box>
              <Box>
                  <ButtonCheckout transactionInfo={transactionData} />
              </Box>
          </Container>
        </>
      )
}

export default Checkout