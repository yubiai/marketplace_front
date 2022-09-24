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
import moment from 'moment'

import {
  Box,
  Text,
  Heading,
  Flex,
  Button,
  Center,
  Avatar,
  Container,
  Divider,
  Grid,
  Stack
} from '@chakra-ui/react'
import useUser from '../../../../hooks/data/useUser'
import Link from 'next/link'
import { profileService } from '../../../../services/profileService'
import StatusOrder from '../../../../components/Infos/StatusOrder'
import EvidencesList from '../../../../components/Infos/EvidencesList'
import { evidenceService } from '../../../../services/evidenceService'

const minimumArbitrationFeeUSD = 90

const OrderDetail = () => {
  const router = useRouter()
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { transactionId } = router.query
  const [orderDetail, setOrderDetail] = useState(null)
  const [buyerInfo, setBuyerInfo] = useState(null)
  const [transactionData, setTransactionData] = useState({})
  const [transactionPayedAmount, setTransactionPayedAmount] = useState('')
  const [transactionFeeAmount, setTransactionFeeAmount] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [operationInProgress, setOperationInProgress] = useState(false)
  //const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

  const [evidences, setEvidences] = useState(null);

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

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

  const getTransactionLink = (transaction = {}, shortLink = false) => {
    const transactionHash = shortLink ?
      "0x..." + transaction.transactionHash.slice(transaction.transactionHash.length - 16) :
      transaction.transactionHash;

    return transaction.networkEnv !== 'main'
      ? `https://${transaction.networkEnv}.etherscan.io/tx/${transactionHash}`
      : `https://etherscan.io/tx/${transactionHash}`;
  }

  const loadEvidences = async (orderInfo) => {
    const response = await evidenceService.getEvidenceByOrderID(orderInfo._id,
      global.profile.token
    )
    setEvidences(response.data)
  }

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(
      transactionId, global.profile.token)
    const { data } = response
    const orderInfo = data.result

    const wallet = (global.profile || {}).eth_address.toLowerCase()

    if (redirectIfCurrentWalletIsNotSeller(orderInfo, wallet)) {
      return
    }

    const { transaction } = await loadOrderData(
      orderInfo.item,
      global.currencyPriceList,
      true
    )

    if (orderInfo && orderInfo.userBuyer) {
      await profileService.getProfile(orderInfo.userBuyer, global.profile.token)
        .then((res) => {
          setBuyerInfo(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }

    setOrderDetail(orderInfo)
    setTransactionData(transaction)
    setTransactionPayedAmount(orderInfo.transaction.transactionPayedAmount)
    setTransactionFeeAmount(orderInfo.transaction.transactionFeeAmount)
    setTransactionDate(orderInfo.transaction.transactionDate)
    loadEvidences(orderInfo)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
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
    } else {
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

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Order As Seller</title>
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
              {moment(orderDetail.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | # {orderDetail?._id}
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
              <Text fontWeight={600}>Status: {orderDetail.status.replace("_", " ")}</Text>
              {
                transactionDate &&
                <Text fontWeight={600}>Date: {moment(transactionDate).format('MM/DD/YYYY, h:mm:ss a')}</Text>
              }
              {
                (transactionPayedAmount && global.klerosEscrowInstance) &&
                <Text fontWeight={600}>
                  Value: {
                    `${global.klerosEscrowInstance.web3.utils.fromWei(transactionPayedAmount)}${orderDetail.item.currencySymbolPrice || 'ETH'}`
                  }
                </Text>
              }
              {
                (transactionFeeAmount && global.klerosEscrowInstance) &&
                <Text fontWeight={600}>
                  Fee: {`${global.klerosEscrowInstance.web3.utils.fromWei(transactionFeeAmount)}ETH`}
                </Text>
              }
              <Link
                href={getTransactionLink(orderDetail.transaction || {})}
                passHref
              >
                <a target="_blank" rel="noopener noreferrer">
                  <Text color="#00abd1" cursor="pointer" wordBreak={'break-all'}>
                    {getTransactionLink(orderDetail.transaction || {}, true)}
                  </Text>
                </a>
              </Link>
            </Box>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
            <Text fontWeight={600} fontSize="2xl">Buyer</Text>
            {buyerInfo ? (
              <Grid
                templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
                templateColumns={{ base: 'none', md: 'repeat(3, 1fr)' }}
                gap={1}
                mt="1em"
              >
                <Center>
                  <Avatar
                    size={'xl'}
                    src={buyerInfo.photo}
                    alt={'Avatar Alt'}
                    mb={4}
                    pos={'relative'}
                  />
                </Center>
                <Center textAlign={"center"}>
                  <Box>
                    <Text fontWeight={600} color="black">{`${buyerInfo.first_name} ${buyerInfo.last_name}`}</Text>
                    <Text>Eth Address: {orderDetail && orderDetail.userBuyer.slice(orderDetail.userBuyer.length - 8)}</Text>
                    <Link
                      href={
                        'https://app.proofofhumanity.id/profile/' +
                        orderDetail.userBuyer
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
            ) : "No data"}
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Text fontWeight={600} fontSize="2xl">Status</Text>

            {orderDetail && orderDetail.status && (
              StatusOrder(orderDetail.status)
            )}

            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Stack
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              mb="1em">
              <Text fontWeight={600} fontSize="2xl">Evidences</Text>
              <Link href={`/profile/evidences/new/${transactionId}`}>
                <Button size="sm" bg="green.500" color="white" _hover={{
                  bg: "gray.400"
                }}>New</Button></Link>
            </Stack>

            <EvidencesList evidences={evidences} />

            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            {(orderDetail.transaction || {}).transactionIndex &&
              orderDetail.status === 'ORDER_DISPUTE_RECEIVER_FEE_PENDING' && (
                <>
                  <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                  <Text fontWeight={600} fontSize="2xl">Actions</Text>
                  <Flex marginTop="auto" justifyContent="space-around">
                    <ButtonEscrowDispute
                      transaction={{ userBuyer: orderDetail.userBuyer || '' }}
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
                </>
              )}

          </Box>
        </ Center>
      </Container>
    </>
  )
}

export default OrderDetail
