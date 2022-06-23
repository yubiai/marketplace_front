import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
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
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder'
import ButtonEscrowDispute from '../../../../components/Buttons/ButtonEscrowDispute'
import Link from 'next/link'
import Loading from '../../../../components/Spinners/Loading'

import {
  Box,
  Text,
  Heading,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  Center,
  Avatar,
  Alert,
  AlertIcon,
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
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(
      transactionId, global?.profile?.token)
    const { data } = response
    const orderInfo = data.result

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

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  }

  const getTransactionLink = (transactionHash = '') => {
    return network === 'kovan'
      ? `https://kovan.etherscan.io/tx/${transactionHash}`
      : `https://etherscan.io/tx/${transactionHash}`
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }

    if (!global.currencyPriceList.length) {
      loadCurrencyPrices(dispatch, global)
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
            disputeStatusParsed,
            global?.profile?.token
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
        <title>Yubiai Marketplace - Order Detail </title>
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
      {operationInProgress && <Loading styleType={'checkout'} />}
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
            Order Detail
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
          <Text marginBottom="1rem" fontWeight={'bold'}>
            Transaction hash:{' '}
          </Text>

          <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
            <Link
              href={getTransactionLink(
                (orderDetail.transaction || {}).transactionHash
              )}
              passHref
            >
              <a target="_blank" rel="noopener noreferrer">
                <Text color="#00abd1" cursor="pointer" wordBreak={'break-all'}>
                  {getTransactionLink(
                    (orderDetail.transaction || {}).transactionHash
                  )}
                </Text>
              </a>
            </Link>
          </Stack>

          <Stack mt={8} direction={'row'} spacing={4}>
            <Box marginTop={'24px'}>
              <Box margin={'2rem 0'}>
                <Button bg="green" color={'white'} onClick={redirectToChat}>
                  Chat with seller
                </Button>
              </Box>
              {(orderDetail.transaction || {}).transactionIndex &&
                orderDetail.status === 'ORDER_CREATED' && (
                  <Flex marginTop="auto" justifyContent="space-around">
                    {transactionData && transactionData.amount && (
                      <ButtonPayOrder
                        transactionIndex={
                          (orderDetail.transaction || {}).transactionIndex
                        }
                        transactionHash={
                          (orderDetail.transaction || {}).transactionHash
                        }
                        amount={(transactionData.amount || {}).value || 0}
                        stepsPostAction={loadOrder}
                        toggleLoadingStatus={toggleLoadingStatus}
                      />
                    )}
                    <ButtonEscrowDispute
                      transactionIndex={
                        (orderDetail.transaction || {}).transactionIndex
                      }
                      transactionHash={
                        (orderDetail.transaction || {}).transactionHash
                      }
                      amount={minimumArbitrationFeeUSD}
                      stepsPostAction={loadOrder}
                      toggleLoadingStatus={toggleLoadingStatus}
                    />
                  </Flex>
                )}
              {transactionData && orderDetail.status === 'ORDER_PAID' && (
                <Alert status="success">
                  <AlertIcon />
                  Order paid
                </Alert>
              )}
              {transactionData &&
                orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
                  <p>
                    Dispute pending to start, waiting for seller to pay the
                    arbitration fee.
                  </p>
                )}
              {transactionData &&
                orderDetail.status === 'ORDER_DISPUTE_IN_PROGRESS' && (
                  <p>Dispute in progress.</p>
                )}
            </Box>
          </Stack>
        </Box>
      </Center>
      </Box>
    </>
  )
}

export default OrderDetail
