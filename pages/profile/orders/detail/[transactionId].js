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
import moment from 'moment'

import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Center,
  Avatar,
  Alert,
  AlertIcon,
  Divider,
  Grid,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import useUser from '../../../../hooks/data/useUser'

const minimumArbitrationFeeUSD = 90

const OrderDetail = () => {
  const router = useRouter()
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { transactionId } = router.query
  const [orderDetail, setOrderDetail] = useState(null)
  const [transactionData, setTransactionData] = useState({})
  const [transactionPayedAmount, setTransactionPayedAmount] = useState('')
  const [operationInProgress, setOperationInProgress] = useState(false)
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(
      transactionId, global.profile.token)
    const { data } = response
    const orderInfo = data.result

    const { transaction } = await loadOrderData(
      orderInfo.item,
      global.currencyPriceList,
      true
    )

    setOrderDetail(orderInfo)
    setTransactionData(transaction)
    setTransactionPayedAmount(orderInfo.transaction.transactionPayedAmount)
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

    if (!global.currencyPriceList.length && (global.profile || {}).token) {
      loadCurrencyPrices(dispatch, global)
      return
    }

    if (!(transactionData || {}).extraData && (global.profile || {}).token) {
      loadOrder()
    } else if ((transactionData || {}).extraData) {
      if (!global.klerosEscrowInstance) {
        setKlerosInstance({ ...transactionData }, dispatch)
      }
      return
    }
  }, [global.profile, transactionId, transactionData, global.currencyPriceList])


  useEffect(() => {
    const checkAndUpdateDisputeStatus = async () => {
      const disputeId = (orderDetail && orderDetail.transaction || {}).disputeId
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
      const wallet = getCurrentWallet(true);
      if (wallet) {
        setArbitratorInstance(wallet, dispatch)
      }
      return
    } else {
      checkAndUpdateDisputeStatus()
    }
  }, [global.arbitratorInstance, orderDetail])

  if (!orderDetail) return <Loading />

  console.log(orderDetail, "orderDetail")
  console.log(process.env.NEXT_PUBLIC_LINK_FLEEK + orderDetail.item.files[0].filename, "transactionData")

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Order Detail </title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      <Container
        maxW="6xl"
        h={'full'}
        display={'flex'}
        flexDirection={'column'}
      >
        <Center py={6}>
          {operationInProgress && <Loading styleType={'checkout'} />}
          <Box
            w={"80%"}
            bg={'white'}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
          >
            <Heading fontSize={'3xl'} fontFamily={'body'}>
              Order Detail
            </Heading>
            <Text fontWeight={600} fontSize={'0.8em'} color={'gray.500'} mt="5px">
              {moment(orderDetail && orderDetail?.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | # {orderDetail?._id}
            </Text>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
            <Text fontWeight={600} fontSize="2xl">Item</Text>
            <Grid
              templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
              templateColumns={{ base: 'none', md: 'repeat(3, 1fr)' }}
              gap={1}
              mt="1em"
            >
              <Center>
                <Avatar
                  size={'xl'}
                  src={`${process.env.NEXT_PUBLIC_LINK_FLEEK && orderDetail && orderDetail.item && orderDetail.item.files && orderDetail.item.files[0] && process.env.NEXT_PUBLIC_LINK_FLEEK + orderDetail.item.files[0].filename}`}
                  alt={'Avatar Alt'}
                  mb={4}
                  pos={'relative'}
                  _after={{
                    content: '""',
                    w: 4,
                    h: 4,
                    bg: orderDetail && orderDetail.item?.published ? 'green.300' : 'red.300',
                    border: '2px solid white',
                    rounded: 'full',
                    pos: 'absolute',
                    bottom: 0,
                    right: 3,
                  }}
                />
              </Center>
              <Center textAlign={"center"}>
                {
                  orderDetail.item &&
                  <Box>
                    <Text noOfLines={3} fontWeight={600}>{orderDetail.item.title}</Text>
                    <Text>Price: {orderDetail.item.price || 0} {orderDetail.item.currencySymbolPrice || 'ETH'}</Text>
                  </Box>
                }
              </Center>

              <Center mt={{ base: '1em', md: '0px' }}>
                <Link href={`/item/${orderDetail && orderDetail.item && orderDetail.item.slug}`}>
                  <Button backgroundColor={'#00abd1'}
                    color={'white'}
                    rounded={'full'}
                    _hover={{
                      bg: "gray.400"
                    }}>See Item</Button>
                </Link>
              </Center>
            </Grid>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Text fontWeight={600} fontSize="2xl">Transaction details</Text>

            <Box p="1em" color="black" bg="orange.100" mt="1em">
              <Flex><Text fontWeight={600}>ID: </Text> <Text>0x...{orderDetail && orderDetail.transaction.transactionHash.slice(orderDetail.transaction.transactionHash.length - 16)}</Text></Flex>
              <Text fontWeight={600}>Status: </Text>
              <Text fontWeight={600}>Date: </Text>
              <Text fontWeight={600}>Value: </Text>
              <Text fontWeight={600}>Fee: </Text>
              <Link
                href={getTransactionLink(
                  (orderDetail.transaction || {}).transactionHash
                )}
                passHref
              >
                <a target="_blank" rel="noopener noreferrer">
                  <Text color="#00abd1" cursor="pointer" wordBreak={'break-all'}>
                    {getTransactionLink(
                      "0x..." + (orderDetail.transaction || {}).transactionHash.slice(orderDetail.transaction.transactionHash.length - 16)
                    )}
                  </Text>
                </a>
              </Link>
            </Box>


            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
            <Text fontWeight={600} fontSize="2xl">Seller</Text>
            <Grid
              templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
              templateColumns={{ base: 'none', md: 'repeat(3, 1fr)' }}
              gap={1}
              mt="1em"
            >

              <Center>
                <Avatar
                  size={'xl'}
                  src={orderDetail && orderDetail.item.seller.photo}
                  alt={'Avatar Alt'}
                  mb={4}
                  pos={'relative'}
                />
              </Center>
              <Center textAlign={"center"}>
                <Box>
                  <Text fontWeight={600} color="black">{`${orderDetail && orderDetail.item.seller.first_name} ${orderDetail && orderDetail.item.seller.last_name}`}</Text>
                  <Text>Eth Address: {orderDetail && orderDetail.item.seller.eth_address.slice(orderDetail.item.seller.eth_address.length - 8)}</Text>
                  <Link
                    href={
                      'https://app.proofofhumanity.id/profile/' +
                      orderDetail && orderDetail.item.seller.eth_address
                    }

                    passHref
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text color="black" as='u' fontStyle={"italic"} _hover={{
                        color: "gray.400"
                      }}>View poh profile</Text>
                    </a>
                  </Link>
                </Box>
              </Center>

              <Center mt={{ base: '1em', md: '0px' }}>
                <Button backgroundColor={'green.500'}
                  color={'white'}
                  rounded={'full'}
                  _hover={{
                    bg: "gray.400"
                  }} onClick={redirectToChat}>Send Message</Button>
              </Center>
            </Grid>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Text fontWeight={600} fontSize="2xl">Status</Text>
            {transactionData && orderDetail.status === 'ORDER_CREATED' && (
              <Alert status="info">
                <AlertIcon />
                <Text color="black" fontWeight={500}>Order created</Text>
              </Alert>
            )}
            {transactionData && orderDetail.status === 'ORDER_PAID' && (
              <Alert status="success">
                <AlertIcon />
                <Text color="black" fontWeight={500}>Order paid</Text>
              </Alert>
            )}
            {transactionData &&
              orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
                <Alert status='warning'>
                  <AlertIcon />
                  <Text color="black" fontWeight={500}>Dispute pending to start, waiting for seller to pay the
                    arbitration fee.</Text>
                </Alert>
              )}
            {transactionData &&
              orderDetail.status === 'ORDER_DISPUTE_IN_PROGRESS' && (
                <Alert status='info'>
                  <AlertIcon />
                  <Text color="black" fontWeight={500}>Dispute in progress.
                  </Text>
                </Alert>
              )}

            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
            <Text fontWeight={600} fontSize="2xl">Actions</Text>

            <Stack mt={4} direction={'row'} spacing={2}>
              <Box w="full">

                {(orderDetail.transaction || {}).transactionIndex &&
                  orderDetail.status === 'ORDER_CREATED' && (
                    <>
                      <SimpleGrid columns={{ base: 0, md: 2 }} spacing={10}>
                        <Box bg='orange.200' p="1em">
                          <Text color="black">
                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought:
                          </Text>
                          <Box mt="1em" textAlign={{ base: "center", md: "left" }}>
                            <ButtonEscrowDispute
                              transaction={{ userBuyer: orderDetail.userBuyer || '' }}
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
                          </Box>
                        </Box>
                        <Box p="1em">
                          {transactionData && transactionPayedAmount && (
                            <>
                              <Text color="black">
                                Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought:
                              </Text>
                              <Box mt="1em" textAlign={{ base: "center", md: "right" }}>
                                <ButtonPayOrder
                                  transactionIndex={
                                    (orderDetail.transaction || {}).transactionIndex
                                  }
                                  transactionHash={
                                    (orderDetail.transaction || {}).transactionHash
                                  }
                                  amount={transactionPayedAmount || '0'}
                                  stepsPostAction={loadOrder}
                                  toggleLoadingStatus={toggleLoadingStatus}
                                />
                              </Box>
                            </>
                          )}
                        </Box>

                      </SimpleGrid>

                    </>
                  )}
              </Box>
            </Stack>
          </Box>
        </Center>
      </Container>
    </>
  )
}

export default OrderDetail
