import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '../../../../services/orderService'
import {
  useGlobal,
  useDispatchGlobal,
} from '../../../../providers/globalProvider'
import { getCurrentWallet } from '../../../../utils/walletUtils'
import { translateStatusIdToNamingInTransaction } from '../../../../utils/orderUtils'
import {
  loadCurrencyPrices,
  loadOrderData,
  setKlerosInstance,
  setArbitratorInstance,
} from '../../../../providers/orderProvider'
import ButtonEscrowDispute from '../../../../components/Buttons/ButtonEscrowDispute'
import Loading from '../../../../components/Spinners/Loading'
import Head from 'next/head'

import {
  Box,
  Text,
  Heading,
  Flex,
  Button,
  Center,
  useColorModeValue,
  Stack,
  Avatar
} from '@chakra-ui/react'

const minimumArbitrationFeeUSD = 90

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
      router.push('/')
      return true
    }
    return false
  }

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  }

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(transactionId)
    const { data } = response
    const orderInfo = data.result

    const yubiaiLS = JSON.parse(localStorage.getItem('Yubiai'))
    const { wallet } = yubiaiLS

    if (redirectIfCurrentWalletIsNotSeller(orderInfo, wallet)) {
      return
    }

    const { transaction } = await loadOrderData(
      orderInfo.items,
      global.currencyPriceList,
      true
    )

    setOrderDetail(orderInfo)
    setTransactionData(transaction)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }

    if (!global.currencyPriceList.length) {
      loadCurrencyPrices(dispatch)
      return
    }

    if (!(transactionData || {}).extraData) {
      loadOrder()
    } else {
      if (!global.klerosEscrowInstance) {
        setKlerosInstance({ ...transactionData }, dispatch)
      }
      return
    }
  }, [transactionId, transactionData, global.currencyPriceList])

  useEffect(() => {
    const checkAndUpdateDisputeStatus = async () => {
      const disputeId = (orderDetail.transaction || {}).disputeId
      if (disputeId) {
        const disputeStatus = await global.arbitratorInstance.disputeStatus(
          disputeId
        )
        const disputeStatusParsed =
          translateStatusIdToNamingInTransaction(disputeStatus)

        if (orderDetail.status !== disputeStatusParsed) {
          const transactionId = (orderDetail.transaction || {}).transactionHash
          await orderService.updateOrderStatus(
            transactionId,
            disputeStatusParsed
          )
        }
      }
    }

    if (!global.arbitratorInstance) {
      setArbitratorInstance(getCurrentWallet(true), dispatch)
      return
    } else {
      checkAndUpdateDisputeStatus()
    }
  }, [global.arbitratorInstance, orderDetail])

  console.log(orderDetail)
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Order As Seller</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      {operationInProgress && <Loading styleType={'checkout'} />}
      <Center py={6}>
        <Box
          maxW={'360px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}
        >
          <Avatar
            size={'xl'}
            src={`${
              orderDetail &&
              orderDetail.items &&
              orderDetail?.items[0]?.pictures[0]
            }`}
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
            Order Detail As Seller
          </Heading>
          <Text fontWeight={600} color={'gray.500'} mb={4}>
            Order ID: {orderDetail?._id}
          </Text>
          <Box>
            {(orderDetail.items || []).map((item, index) => (
              <Box padding="1rem" key={`order-item-${index}`}>
                <Text noOfLines={3}>{item.title}</Text>
                <Text>Price: {item.price || 0}</Text>
                {item.currencySymbolPrice || 'ETH'}
              </Box>
            ))}
          </Box>
          <Text marginBottom="1rem">
            Transaction hash: {(orderDetail.transaction || {}).transactionHash}
          </Text>

          <Stack
            align={'center'}
            justify={'center'}
            direction={'row'}
            mt={6}
          ></Stack>

          <Stack mt={2} direction={'row'} spacing={4}>
            <Box marginTop={'24px'}>
              <Box margin={'2rem 0'}>
                <Button bg="green" color={'white'} onClick={redirectToChat}>
                  Chat with seller
                </Button>
              </Box>
              {(orderDetail.transaction || {}).transactionIndex &&
                orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
                  <Flex marginTop="auto" justifyContent="space-around">
                    <ButtonEscrowDispute
                      transactionIndex={
                        (orderDetail.transaction || {}).transactionIndex
                      }
                      transactionHash={
                        (orderDetail.transaction || {}).transactionHash
                      }
                      amount={minimumArbitrationFeeUSD}
                      asSeller={true}
                      stepsPostAction={loadOrder}
                      toggleLoadingStatus={toggleLoadingStatus}
                    />
                  </Flex>
                )}
              {(orderDetail.transaction || {}).transactionIndex &&
                orderDetail.status === 'ORDER_DISPUTE_IN_PROGRESS' && (
                  <p>Dispute in progress</p>
                )}
            </Box>
          </Stack>
        </Box>
      </Center>
    </>
  )
}

export default OrderDetail
