import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { orderService } from '../../../../services/orderService';
import {
  useGlobal,
  useDispatchGlobal,
} from '../../../../providers/globalProvider';
import YubiaiPaymentArbitrable from '../../../../utils/escrow-utils/yubiaiPaymentArbitrable';
import {
  loadCurrencyPrices,
  loadOrderData,
} from '../../../../providers/orderProvider';
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder';
import ButtonEscrowDispute from '../../../../components/Buttons/ButtonEscrowDispute';
import Link from 'next/link';
import Loading from '../../../../components/Spinners/Loading';
import moment from 'moment';

import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Center,
  Avatar,
  Divider,
  Grid,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import useUser from '../../../../hooks/data/useUser';
import StatusOrder from '../../../../components/Infos/StatusOrder';
import EvidencesList from '../../../../components/Infos/EvidencesList';
import { evidenceService } from '../../../../services/evidenceService';

const OrderDetail = () => {
  const router = useRouter()
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { transactionId } = router.query
  const [orderDetail, setOrderDetail] = useState(null)
  const [transactionData, setTransactionData] = useState({})
  const [transactionMeta, setTransactionMeta] = useState(null)
  const [transactionPayedAmount, setTransactionPayedAmount] = useState('')
  const [transactionFeeAmount, setTransactionFeeAmount] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [operationInProgress, setOperationInProgress] = useState(false)
  const [yubiaiPaymentArbitrableInstance, setYubiaiPaymentArbitrableInstance] = useState(null)

  const [evidences, setEvidences] = useState(null);

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
    setTransactionFeeAmount(orderInfo.transaction.transactionFeeAmount)
    setTransactionDate(orderInfo.transaction.transactionDate)
    setTransactionMeta(orderInfo.transaction.transactionMeta)
    loadEvidences(orderInfo)
  }

  const loadEvidences = async (orderInfo) => {
    const response = await evidenceService.getEvidenceByOrderID(orderInfo._id,
      global.profile.token
    )
    setEvidences(response.data)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  }

  const getTransactionLink = (transaction = {}, transactionMeta = {}, shortLink = false) => {
    const transactionHash = shortLink ?
      "0x..." + transactionMeta?.transactionHash?.slice(transactionMeta?.transactionHash.length - 16) :
      transactionMeta?.transactionHash;

    return transaction.networkEnv !== 'main'
      ? `https://${transaction.networkEnv}.etherscan.io/tx/${transactionHash}`
      : `https://etherscan.io/tx/${transactionHash}`;
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }

    const loadCurrencies = async () => {
      const networkType = await yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType();
      loadCurrencyPrices(dispatch, global, networkType);
    }

    const setContractInstance = async () => {
      const web3 = new Web3(
        process.env.NEXT_PUBLIC_INFURA_ENDPOINT ||
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
      const yubiaiArbitrableInstance = new YubiaiPaymentArbitrable(
        web3, global?.profile?.eth_address.toLowerCase());
      await yubiaiArbitrableInstance.initContract();
      setYubiaiPaymentArbitrableInstance(yubiaiArbitrableInstance);
    }

    if (!yubiaiPaymentArbitrableInstance) {
      setContractInstance();
      return;
    }

    if (!global.currencyPriceList.length && (global.profile || {}).token && (yubiaiPaymentArbitrableInstance || {}).web3) {
      loadCurrencies();
      return;
    }

    if (!(transactionData || {}).extraData && (global.profile || {}).token) {
      loadOrder();
    }
  }, [global.profile, transactionId, transactionData, global.currencyPriceList, yubiaiPaymentArbitrableInstance])

  if (!orderDetail) return <Loading />;

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
              <Flex><Text fontWeight={600}>ID: </Text> <Text>0x...{transactionMeta && transactionMeta.transactionHash.slice(transactionMeta.transactionHash.length - 16)}</Text></Flex>
              <Text fontWeight={600}>Status: {orderDetail.status.replace("_", " ")}</Text>
              {
                transactionDate &&
                <Text fontWeight={600}>Date: {moment(transactionDate).format('MM/DD/YYYY, h:mm:ss a')}</Text>
              }
              {
                (transactionPayedAmount && yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  Value: {
                    `${yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionPayedAmount)}${orderDetail.item.currencySymbolPrice || 'ETH'}`
                  }
                </Text>
              }
              {
                (transactionFeeAmount && yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  Fee: {`${yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionFeeAmount)}`}
                </Text>
              }
              <Link
                href={getTransactionLink((orderDetail.transaction || {}), transactionMeta)}
                passHref
              >
                <a target="_blank" rel="noopener noreferrer">
                  <Text color="#00abd1" cursor="pointer" wordBreak={'break-all'}>
                    {getTransactionLink((orderDetail.transaction || {}), transactionMeta, true)}
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

            <Box width={{ base: "100%", md: "30%" }}>
              {orderDetail && orderDetail.status && (
                StatusOrder(orderDetail.status)
              )}
            </Box>

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
            <Text fontWeight={600} fontSize="2xl">Actions</Text>

            <Stack mt={4} direction={'row'} spacing={2}>
              <Box w="full">

                {(orderDetail.transaction || {}).transactionIndex &&
                  orderDetail.status === 'ORDER_CREATED' && (
                    <>
                      <SimpleGrid columns={{ base: 0, md: 2 }} spacing={10}>
                        <Box p="1em">
                          {transactionData && transactionPayedAmount && (
                            <>
                              <Text color="black">
                                Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought:
                              </Text>
                              <Box mt="1em" textAlign={{ base: "center", md: "left" }}>
                                <ButtonPayOrder
                                  transactionIndex={
                                    (orderDetail.transaction || {}).transactionIndex
                                  }
                                  transactionHash={transactionMeta?.transactionHash}
                                  amount={transactionPayedAmount || '0'}
                                  stepsPostAction={loadOrder}
                                  toggleLoadingStatus={toggleLoadingStatus}
                                  yubiaiPaymentArbitrableInstance={yubiaiPaymentArbitrableInstance}
                                />
                              </Box>
                            </>
                          )}
                        </Box>
                        <Box bg='orange.200' p="1em">
                          <Text color="black">
                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought:
                          </Text>
                          <Box mt="1em" textAlign={{ base: "center", md: "right" }}>
                            <ButtonEscrowDispute
                              transaction={{ userBuyer: orderDetail.userBuyer || '' }}
                              transactionIndex={
                                (orderDetail.transaction || {}).transactionIndex
                              }
                              transactionHash={transactionMeta?.transactionHash}
                              stepsPostAction={loadOrder}
                              toggleLoadingStatus={toggleLoadingStatus}
                              yubiaiPaymentArbitrableInstance={yubiaiPaymentArbitrableInstance}
                            />
                          </Box>
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
