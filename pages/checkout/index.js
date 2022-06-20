import { Box, Container, Text, Flex, Image, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import ButtonCheckout from '../../components/Buttons/ButtonCheckout'
import Loading from '../../components/Spinners/Loading'
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider'
import {
  loadCurrencyPrices,
  loadOrderData,
  setKlerosInstance,
} from '../../providers/orderProvider'
import { orderService } from '../../services/orderService'
import { totalAmountOrder } from '../../utils/orderUtils'
import { channelService } from '../../services/channelService'

const Checkout = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const [orderData, setOrderData] = useState({})
  const [transactionData, setTransactionData] = useState({})
  const [operationInProgress, setOperationInProgress] = useState(false)
  const [messageOpened, setMessageOpened] = useState(true)

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
    const orderResponse = await orderService.createOrder({
      order: {
        items: [...orderData.orders],
        userBuyer: currentWalletAccount,
        status: 'ORDER_CREATED',
      },
      transactionInfo: transactionResult,
    })
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
        <Container
          padding={'2rem 0'}
          position={'relative'}
          height={'calc(100vh - 180px)'}
        >
          {operationInProgress && <Loading styleType={'checkout'} />}
          <Heading>Order summary</Heading>
          <Flex padding={'1rem 0'} flexDirection="column">
            {orderData.orders &&
              orderData.orders.length &&
              orderData.orders.map((orderItem, orderIndex) => (
                <Flex key={`order-item-${orderIndex}`} margin="1.25rem 0">
                  <Image
                    objectFit={'cover'}
                    maxWidth="120px"
                    marginRight="1rem"
                    src={orderItem.pictures[0]}
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="18px">
                      {orderItem.title}
                    </Text>
                    <Text fontSize="14px">
                      Price: {orderItem.price}{' '}
                      {orderItem.currencySymbolPrice || 'ETH'}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </Flex>
          <Box borderTop="1.5px solid #212121">
            <Text>
              <span style={{ fontSize: '18px' }}>Total:</span>{' '}
              {totalAmountOrder(orderData.orders)}{' '}
              {((orderData.orders || [])[0] || {}).currencySymbolPrice || 'ETH'}
            </Text>
          </Box>
          {messageOpened && (
            <Box
              bg="#FFFF8A"
              margin={'1rem 0'}
              padding={'1.5rem .5rem'}
              borderRadius={2}
              position="relative"
            >
              <Image
                alt={'Close'}
                width={'12px'}
                position={'absolute'}
                right={2}
                top={2}
                objectFit={'cover'}
                src={'/static/images/close.png'}
                fallbackSrc={'/static/images/close.png'}
                cursor="pointer"
                onClick={() => setMessageOpened(false)}
              />
              <Text>
                When you click on &apos;Hire service&apos;, your payment will be
                held and it will be released to the seller when you get the
                service.
              </Text>
            </Box>
          )}
          <Flex justifyContent="center" padding={'1rem 0'}>
            <ButtonCheckout
              transactionInfo={transactionData}
              toggleLoadingStatus={toggleLoadingStatus}
              createOrder={createOrder}
            />
          </Flex>
        </Container>
      </>
    )
  )
}

export default Checkout
