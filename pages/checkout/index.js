import {
  Box,
  Text,
  Heading,
  Center,
  Avatar,
  Stack,
  AlertIcon,
  Alert,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import ButtonCheckout from '../../components/Buttons/ButtonCheckout'
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider'
import {
  loadCurrencyPrices,
  loadOrderData,
  setKlerosInstance,
} from '../../providers/orderProvider'
import { orderService } from '../../services/orderService'
import { channelService } from '../../services/channelService'

const Checkout = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const [orderData, setOrderData] = useState({})
  const [transactionData, setTransactionData] = useState({})
  const [operationInProgress, setOperationInProgress] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      const result = await loadOrderData(
        [...global.itemsToCheckout],
        global.currencyPriceList
      )
      const { orderInfo, transaction } = result
      setOrderData(orderInfo)
      setTransactionData(transaction)
    }

    if (!global.currencyPriceList.length) {
      loadCurrencyPrices(dispatch)
      return
    }

    if (!global.itemsToCheckout.length) {
      return
    }

    if (!transactionData.extraData) {
      loadOrder()
    } else {
      if (!global.klerosEscrowInstance) {
        setKlerosInstance({ ...transactionData }, dispatch)
      }
      return
    }
  }, [transactionData, global.itemsToCheckout, global.currencyPriceList])

  const createOrder = async (transactionResult = {}) => {
    const currentWalletAccount = await global.klerosEscrowInstance.getAccount()
    const orderResponse = await orderService.createOrder(
      {
        order: {
          items: [...orderData.orders],
          userBuyer: currentWalletAccount,
          status: 'ORDER_CREATED',
        },
        transactionInfo: transactionResult,
      },
      global?.profile?.token
    )
    const { data } = orderResponse
    const { result } = data

    const orderId = result._id
    const buyerId = global.profile._id
    const sellerId = orderData.orders[0].seller._id

    await channelService.createChannel(
      {
        order_id: orderId,
        buyer: buyerId,
        seller: sellerId,
      },
      global.profile.token
    )

    toggleLoadingStatus(false)
    router.push(`/profile/orders/detail/${transactionResult.transactionHash}`)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  return (
    transactionData && (
      <>
        <Head>
          <title>Yubiai Marketplace - Search Item</title>
          <meta
            name="keywords"
            content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
          />
        </Head>
        <Box
          h={{ base: 'full', sm: 'full', md: 'full', lg: 'full', xl: '100vh' }}
          m="2em"
        >
          <Center py={6}>
            <Box
              maxW={'360px'}
              w={'full'}
              bg={'white'}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Avatar
                size={'xl'}
                src={orderData.orders && orderData.orders[0].pictures[0]}
                alt={'Avatar Alt'}
                mb={4}
                pos={'relative'}
                _after={{
                  content: '""',
                  w: 4,
                  h: 4,
                  bg: 'green.300',
                  border: '2px solid white',
                  rounded: 'full',
                  pos: 'absolute',
                  bottom: 0,
                  right: 3,
                }}
              />
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                Order summary
              </Heading>
              <Text fontWeight={600} color={'gray.500'} mb={4}>
                Price: {orderData.orders && orderData.orders[0].price}{' '}
                {(orderData.orders &&
                  orderData.orders[0].currencySymbolPrice) ||
                  'ETH'}
              </Text>
              <Text textAlign={'center'} color={'gray.700'} px={3}>
                {orderData.orders && orderData.orders[0].title}
              </Text>

              <Stack
                align={'center'}
                justify={'center'}
                direction={'row'}
                mt={6}
              ></Stack>
              <Alert status="warning">
                <AlertIcon />
                When you click on &apos;Hire service&apos;, your payment will be
                held and it will be released to the seller when you get the
                service.{' '}
              </Alert>

              <Stack mt={8}>
                <ButtonCheckout
                  transactionInfo={transactionData}
                  toggleLoadingStatus={toggleLoadingStatus}
                  createOrder={createOrder}
                  operationInProgress={operationInProgress}
                />
              </Stack>
            </Box>
          </Center>
        </Box>
      </>
    )
  )
}

export default Checkout
