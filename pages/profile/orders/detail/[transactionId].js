import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { orderService } from '../../../../services/orderService';
import {
  useGlobal,
  useDispatchGlobal,
} from '../../../../providers/globalProvider';
import {
  loadCurrencyPrices,
  loadOrderData,
  setYubiaiInstance
} from '../../../../providers/orderProvider';
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder';
import ButtonStartClaim from '../../../../components/Buttons/ButtonStartClaim';
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
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react';
import useUser from '../../../../hooks/data/useUser';
import {
  StatusOrderByState,
  ONGOING_STATUS,
  statusDescMap,
} from '../../../../components/Infos/StatusOrder';
import { ChevronRightIcon } from '@chakra-ui/icons';

const OrderDetail = () => {
  /**
   * External dependencies
   */
  const router = useRouter();
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const { transactionId } = router.query;

  /**
   * Order and transaction info
   */
  const [orderDetail, setOrderDetail] = useState(null);
  const [transactionData, setTransactionData] = useState({});
  const [transactionMeta, setTransactionMeta] = useState(null);
  const [transactionPayedAmount, setTransactionPayedAmount] = useState('');
  const [transactionFeeAmount, setTransactionFeeAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [deal, setDeal] = useState(null);

  /**
   * Auxiliar status and instances
   */
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [isDealEnabledToClaim, setIsDealEnabledToClaim] = useState(false);

  const { user, loggedOut } = useUser();

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout');
    }
  }, [user, loggedOut, router, dispatch]);

  const loadOrder = async () => {
    const response = await orderService.getOrderByTransaction(
      transactionId, global.profile.token);
    const { data } = response;
    const orderInfo = data.result;

    const { transaction } = await loadOrderData(
      orderInfo.item, global.currencyPriceList, true);

    setOrderDetail(orderInfo);
    setTransactionData(transaction);
    setTransactionPayedAmount(orderInfo.transaction.transactionPayedAmount);
    setTransactionFeeAmount(orderInfo.transaction.transactionFeeAmount);
    setTransactionDate(orderInfo.transaction.transactionDate * 1000);
    setTransactionMeta(orderInfo.transaction.transactionMeta);
  };

  const setDealInfo = async transaction => {
    const fullStatus = await global.yubiaiPaymentArbitrableInstance.getFullStatusOfDeal(transaction.transactionIndex);
    const currentTS = Math.floor((new Date()).getTime() / 1000);
    setDeal(fullStatus);
    setIsDealEnabledToClaim(
      currentTS <= fullStatus.claimCreatedAt + fullStatus.timeForClaim);
  }

  const toggleLoadingStatus = status => {
    setOperationInProgress(status);
  };

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  };

  const getTransactionLink = (transaction = {}, transactionMeta = {}, shortLink = false) => {
    const transactionHash = shortLink ?
      "0x..." + transactionMeta?.transactionHash?.slice(transactionMeta?.transactionHash.length - 16) :
      transactionMeta?.transactionHash;

    return transaction.networkEnv !== 'mainnet'
      ? `https://${transaction.networkEnv}.etherscan.io/tx/${transactionHash}`
      : `https://etherscan.io/tx/${transactionHash}`;
  };

  useEffect(() => {
    if (!transactionId) {
      return;
    }

    const loadCurrencies = async () => {
      const networkType = await global.yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType();
      loadCurrencyPrices(dispatch, global, networkType);
    }

    if ((orderDetail || {}).transaction && global.yubiaiPaymentArbitrableInstance) {
      setDealInfo((orderDetail || {}).transaction);
    }

    if (!global.yubiaiPaymentArbitrableInstance) {
      setYubiaiInstance(dispatch);
      return;
    }

    if (!global.currencyPriceList.length && (global.profile || {}).token && (global.yubiaiPaymentArbitrableInstance || {}).web3) {
      loadCurrencies();
      return;
    }

    if (!(transactionData || {}).extraData && (global.profile || {}).token) {
      loadOrder();
    }
  }, [global.profile, transactionId, transactionData, global.currencyPriceList, global.yubiaiPaymentArbitrableInstance]);

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
        <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
          <BreadcrumbItem>
            <Link href="/" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>Home</Text></Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
              <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>Profile</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/profile/orders/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
              <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>Orders</Text>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Detail</Text>
          </BreadcrumbItem>
        </Breadcrumb>
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
              {moment(orderDetail && orderDetail?.dateOrder).format('DD/MM/YYYY, h:mm:ss a')} | # {orderDetail?._id}
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
                    <Text>Price: {orderDetail.item.price || 0} {orderDetail.item.currencySymbolPrice}</Text>
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
              <Text fontWeight={600}>Status: {(deal || {}).dealStatus && statusDescMap(
                deal.dealStatus,
                deal.claimStatus,
                deal.claimCount,
                deal.maxClaimsAllowed,
                deal.disputeId
              )}</Text>
              {
                transactionDate &&
                <Text fontWeight={600}>Date: {moment(transactionDate).format('MM/DD/YYYY, h:mm:ss a')}</Text>
              }
              {
                (transactionPayedAmount && global.yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  Value: {
                    `${global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionPayedAmount)}${orderDetail.item.currencySymbolPrice || 'ETH'}`
                  }
                </Text>
              }
              {
                (transactionFeeAmount && global.yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  Fee: {`${global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionFeeAmount)}`}
                </Text>
              }
              <Link
                href={getTransactionLink((orderDetail.transaction || {}), transactionMeta)}
                passHref legacyBehavior
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
                    href={`https://app.proofofhumanity.id/profile/${orderDetail && orderDetail.item.seller.eth_address}`}
                    passHref legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Text color="black" as='u' fontStyle={"italic"} _hover={{ color: "gray.400" }}>View poh profile</Text>
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
              {(deal || {}).dealStatus && StatusOrderByState(
                deal.dealStatus,
                deal.claimStatus,
                deal.claimCount,
                deal.maxClaimsAllowed,
                deal.disputeId
              )}
            </Box>
            {
              (deal || {}).dealStatus === ONGOING_STATUS &&
              <Box>
                <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                <Text fontWeight={600} fontSize="2xl">Actions</Text>
                <Stack mt={4} direction={'row'} spacing={2}>
                  <Box w="full">
                    <SimpleGrid columns={{ base: 0, md: 2 }} spacing={10}>
                      <Box p="1em">
                        {transactionData && transactionPayedAmount && (
                          <>
                            <Text color="black">
                            Always confirm that you have received the buyer’s service before tapping [Release payment]. DO NOT release crypto to the buyer if you haven’t received their service.
                            </Text>
                            <Box mt="1em" textAlign={{ base: "center", md: "left" }}>
                              <ButtonPayOrder
                                transactionInfo={{
                                  transactionIndex: (orderDetail.transaction || {}).transactionIndex,
                                  transactionHash: transactionMeta.transactionHash
                                }}
                                amount={transactionPayedAmount || '0'}
                                stepsPostAction={loadOrder}
                                toggleLoadingStatus={toggleLoadingStatus}
                                yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance}
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                      {
                        isDealEnabledToClaim &&
                        <Box bg='orange.200' p="1em">
                          <Text color="black">
                            {
                              !(deal || {}).isOver && "If you encounter any issues during the transaction process, you can start a claim and a third party intermediary will assist you on solving your case."
                            }
                            {
                              (deal || {}).isOver &&
                              "You cannot claim this order because the status of this transaction is over."
                            }
                          </Text>
                          {
                            !(deal || {}).isOver &&
                            <Box mt="1em" textAlign={{ base: "center", md: "right" }}>
                              <ButtonStartClaim transactionMeta={transactionMeta} profile={global.profile} />
                            </Box>
                          }
                        </Box>
                      }
                    </SimpleGrid>
                  </Box>
                </Stack>
              </Box>
            }
          </Box>
        </Center>
      </Container>
    </>
  )
}

export default OrderDetail
