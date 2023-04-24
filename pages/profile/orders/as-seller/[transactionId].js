import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { orderService } from '../../../../services/orderService';
import { dealService } from '../../../../services/dealService';
import {
  useGlobal,
  useDispatchGlobal,
} from '../../../../providers/globalProvider';
import {
  loadCurrencyPrices,
  loadOrderData,
  setYubiaiInstance,
} from '../../../../providers/orderProvider';
import ButtonPayOrder from '../../../../components/Buttons/ButtonPayOrder';
import ButtonChallengeClaim from '../../../../components/Buttons/ButtonChallengeClaim';
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
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner
} from '@chakra-ui/react';
import useUser from '../../../../hooks/data/useUser';
import { StatusOrderByState, CLAIMED_STATUS, statusDescMap, StatusOrder, ONGOING_STATUS } from '../../../../components/Infos/StatusOrder';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { channelService } from '../../../../services/channelService';
import useTranslation from 'next-translate/useTranslation';
import ButtonCloseDeal from '../../../../components/Buttons/ButtonCloseDeal';
import { calculateFinishDate } from '../../../../utils/orderUtils';
import ButtonProtocolProfile from '../../../../components/Buttons/ButtonProtocolProfile';


const OrderDetail = () => {
  /**
   * External dependencies
   */
  const router = useRouter();
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const toast = useToast();

  const { transactionId } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loadingMarkDone, setLoadingMarkDone] = useState(false);

  /**
   * Order and transaction info
   */
  const [orderDetail, setOrderDetail] = useState(null);
  const { t } = useTranslation("orders");
  const [transactionData, setTransactionData] = useState({});
  const [transactionMeta, setTransactionMeta] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [transactionPayedAmount, setTransactionPayedAmount] = useState('');
  const [transactionFeeAmount, setTransactionFeeAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [deal, setDeal] = useState({ deal: {}, claim: {} });
  const [isLateToChallenge, setIsLateToChallenge] = useState(false);

  /**
   * Auxiliar status and instances
   */
  const [operationInProgress, setOperationInProgress] = useState(false);

  const [verifyMessages, setVerifyMessages] = useState(false);

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

    // Check if it is the buyer if not outside
    const userEthAddress = global && global.profile && global.profile.eth_address.toUpperCase();
    const userSeller = orderInfo && orderInfo.userSeller && orderInfo.userSeller.toUpperCase();

    if (userEthAddress != userSeller) {
      console.error('Not authorized or the order does not exist.')
      toast({
        title: 'Order',
        description: 'Not authorized or the order does not exist.',
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return router.replace('/logout');
    }

    const { transaction } = await loadOrderData(
      orderInfo.item, global.currencyPriceList, true);

    setOrderDetail(orderInfo);
    setTransactionData(transaction);
    setTransactionPayedAmount(orderInfo.transaction.transactionPayedAmount);
    setTransactionFeeAmount(orderInfo.transaction.transactionFeeAmount);
    setTransactionDate(orderInfo.transaction.transactionDate * 1000);
    setTransactionMeta(orderInfo.transaction.transactionMeta);

    // Verifica si hay menssages entre los users, para activar las opciones.
    const verifyMessages = await channelService.getMessagesByOrderId(
      orderInfo._id, global.profile.token);

    if (verifyMessages.data) {
      setVerifyMessages(true)
    }

  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  };

  const redirectToChat = () => {
    const { _id } = orderDetail
    router.push(`/profile/mailboxs/${_id}`)
  };

  const getTransactionLink = (transaction = {}, transactionMeta = {}, shortLink = false) => {
    const transactionHash = shortLink ?
      "0x..." + transactionMeta.transactionHash.slice(transactionMeta.transactionHash.length - 16) :
      transactionMeta.transactionHash;

    if (transaction.networkEnv === "gnosis") {
      return `https://gnosisscan.io/tx/${transactionHash}`;
    }

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
    };

    async function initialArbInstance() {
      if (!global.yubiaiPaymentArbitrableInstance) {
        const res = await setYubiaiInstance(dispatch);
        if (!res) {
          toast({
            title: "Wrong Network",
            description: "Change the network to one that is enabled.",
            position: 'top-right',
            status: 'warning',
            duration: 3000,
            isClosable: true
          });
          setTimeout(() => {
            router.push("/logout");
          }, 3000);
          return
        }
        return
      }
    }

    initialArbInstance();

    const setDealInfo = async transaction => {
      const fullStatus = await global.yubiaiPaymentArbitrableInstance.getFullStatusOfDeal(transaction.transactionIndex);
      const { timeForChallenge } = await global.yubiaiPaymentArbitrableInstance.contract.methods.settings().call();
      const currentTS = Math.floor((new Date()).getTime() / 1000);
      const limitClaimTime = Math.floor(
        (parseInt(fullStatus.claimCreatedAt, 10) + parseInt(timeForChallenge, 10)) / 1000);

      // Obtener Evidence
      if (fullStatus && fullStatus.claim.claimCount > 0 && fullStatus.claim.claimID) {
        const response = await dealService.getEvidenceByClaimID(fullStatus.claim.claimID);
        setEvidence(response.data);
      }

      setDeal(fullStatus);
      setIsLateToChallenge(currentTS < limitClaimTime);
    }

    if ((orderDetail || {}).transaction && global.yubiaiPaymentArbitrableInstance) {
      setDealInfo((orderDetail || {}).transaction);
    }

    if (!global.currencyPriceList.length && (global.profile || {}).token && (global.yubiaiPaymentArbitrableInstance || {}).web3) {
      loadCurrencies();
      return;
    }

    if (!(transactionData || {}).extraData && (global.profile || {}).token && global.yubiaiPaymentArbitrableInstance) {
      loadOrder();
    }
  }, [global.profile, transactionId, transactionData, global.currencyPriceList, global.yubiaiPaymentArbitrableInstance])

  const onMarkDone = async () => {
    setLoadingMarkDone(true)
    try {
      await orderService.updateOrderCompletedBySeller(
        transactionId, {
        orderCompletedBySeller: true
      }, global.profile.token);

      loadOrder();

      toast({
        title: t('Order'),
        description: t('Successfully changed the status'),
        position: 'top-right',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setTimeout(() => {
        setLoadingMarkDone(false)
        onClose()
      }, 2000);
      return

    } catch (err) {
      console.error(err);
      toast({
        title: 'Order',
        description: 'Error changing order status.',
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setTimeout(() => {
        setLoadingMarkDone(false)
        onClose()
      }, 2000);
      return
    }
  }

  if (!orderDetail) return <Loading />;

  console.log((deal || {}))

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Sales</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, poh, metamask"
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
            }}>{t("Home")}</Text></Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/profile/" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Profile")}</Text></Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/profile/orders/sales" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Sales")}</Text></Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{t("Detail")}</Text>
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
              {t("Sales")}
            </Heading>
            <Text fontWeight={600} fontSize={'0.8em'} color={'gray.500'} mt="5px">
              {moment(orderDetail && orderDetail?.dateOrder).format('MM/DD/YYYY, h:mm:ss a')} | Deal # {(deal || {}).deal.dealId}
            </Text>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
            <Text fontWeight={600} fontSize="2xl">{t("Item")}</Text>
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
              {
                orderDetail.item && (
                  <Center textAlign={"center"} noOfLines={4}>
                    <Box width={"full"} >
                      <Text fontWeight={600}>{orderDetail.item.title}</Text>
                      <Text>{t("Price")} {
                        `${global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionPayedAmount)} ${orderDetail.item.currencySymbolPrice || 'ETH'}`
                      }</Text>
                    </Box>
                  </Center>
                )
              }

              <Center mt={{ base: '1em', md: '0px' }}>
                <Link href={`/item/${orderDetail && orderDetail.item && orderDetail.item.slug}`}>
                  <Button backgroundColor={'#00abd1'}
                    color={'white'}
                    rounded={"5px"} _hover={{
                      bg: "gray.400"
                    }}>{t("See Item")}</Button>
                </Link>
              </Center>
            </Grid>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Text fontWeight={600} fontSize="2xl">{t("Transaction details")}</Text>

            <Box p="1em" color="black" bg="orange.100" mt="1em" mb="1em">
              <Flex><Text fontWeight={600}>ID: </Text> <Text>0x...{transactionMeta && transactionMeta.transactionHash.slice(transactionMeta.transactionHash.length - 16)}</Text></Flex>
              <Text fontWeight={600}>Status: {(deal || {}).deal.dealStatus && statusDescMap(
                deal.deal,
                deal.claim
              )}</Text>
              {
                transactionDate &&
                <Text fontWeight={600}>{t("Date")} {moment(transactionDate).format('MM/DD/YYYY, h:mm:ss a')}</Text>
              }
              {
                (transactionPayedAmount && global.yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  {t("Value")}: {
                    `${global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionPayedAmount)}${orderDetail.item.currencySymbolPrice || 'ETH'}`
                  }
                </Text>
              }
              {
                (transactionFeeAmount && global.yubiaiPaymentArbitrableInstance) &&
                <Text fontWeight={600}>
                  {t("Fee")}: {`${global.yubiaiPaymentArbitrableInstance.web3.utils.fromWei(transactionFeeAmount)}`}
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
            <Text fontWeight={600} fontSize="2xl">{t("Buyer")}</Text>
            <Grid
              templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
              templateColumns={{ base: 'none', md: 'repeat(3, 1fr)' }}
              gap={1}
              mt="1em"
            >

              <Center>
                <Avatar
                  size={'xl'}
                  src={orderDetail && orderDetail.item.buyer.photo}
                  alt={'Avatar Alt'}
                  mb={4}
                  pos={'relative'}
                />
              </Center>
              <Center textAlign={"center"}>
                <Box>
                  <Text fontWeight={600} color="black">{`${orderDetail && orderDetail.item.buyer.name}`}</Text>
                  <Text>{t("Eth Address")}: {orderDetail && orderDetail.item.buyer.eth_address.slice(orderDetail.item.buyer.eth_address.length - 8)}</Text>
                  <Center mt="0.6em">
                    {orderDetail && orderDetail.item.buyer && orderDetail.item.buyer.eth_address && orderDetail.item.buyer.poh_info && orderDetail.item.buyer.poh_info.first_name && (
                      <ButtonProtocolProfile profile={orderDetail.item.buyer} protocol={"poh"} />
                    )}
                    {orderDetail && orderDetail.item.buyer && orderDetail.item.buyer.eth_address && orderDetail.item.buyer.lens_info && orderDetail.item.buyer.lens_info.handle && (
                      <ButtonProtocolProfile profile={orderDetail.item.buyer} protocol={"lens"} />
                    )}
                  </Center>
                </Box>
              </Center>

              <Center mt={{ base: '1em', md: '0px' }}>
                <Button backgroundColor={'green.500'}
                  color={'white'}
                  rounded={"5px"} _hover={{
                    bg: "gray.400"
                  }} onClick={redirectToChat}>{t("Send Message")}</Button>
              </Center>
            </Grid>
            <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />

            <Text fontWeight={600} fontSize="2xl" >{t("Status ")}</Text>
            {
              orderDetail.status != "ORDER_REFUNDED" && (deal || {}).deal.dealStatus && StatusOrderByState(
                deal.deal,
                deal.claim,
                t
              )
            }

            {
              orderDetail.status == "ORDER_REFUNDED" && (
                <>
                  {StatusOrder("ORDER_REFUNDED", t)}
                </>
              )
            }

            {(deal || {}).deal.dealStatus === ONGOING_STATUS && (
              <>
                <Text mt="1em" fontWeight={"bold"}>{t("Finish Date")}: {calculateFinishDate(transactionDate, deal.claim.claimCount, deal.claim.claimSolvedAt)}</Text>
              </>
            )}

            {!verifyMessages && (
              <>
                <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                <Text fontWeight={600} fontSize="2xl">{t("Actions")}</Text>
                <Text fontWeight={"normal"}>{t("Actions as seller will be available when there is a message interaction")}</Text>
              </>
            )}


            {/* Actions Mark Job as Done */}
            {
              (deal || {}).deal.dealStatus === ONGOING_STATUS && !orderDetail.orderCompletedBySeller && verifyMessages &&
              <>
                <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                <Text fontWeight={600} fontSize="2xl">{t("Actions")}</Text>
                <Button
                  mt="1em"
                  width={{ base: "100%", md: "50%" }}
                  backgroundColor={'#00abd1'}
                  color={'white'}
                  rounded={'5px'}
                  fontSize={{ base: "0.9em", md: "1.4em" }}
                  cursor={'pointer'}
                  onClick={onOpen}
                  isDisabled={orderDetail && orderDetail.orderCompletedBySeller}
                  _hover={{
                    bg: "blue.300"
                  }}
                >
                  {t("Mark job as done")}
                </Button>
                <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{t("Order Status")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      {t("Are you sure you want to mark the job as completed?")}
                    </ModalBody>

                    <ModalFooter>
                      {!loadingMarkDone ? (
                        <>
                          <Button backgroundColor={'#00abd1'} onClick={() => onMarkDone()}
                            color={'white'} mr={3}>
                            {t("Yes, Mark job as done")}
                          </Button>
                          <Button onClick={onClose}>{t("Cancel")}</Button>
                        </>
                      ) : (
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="blue.500"
                          size="md"
                        />
                      )}
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Box width={{ base: "100%", md: "50%" }}>
                  <Text mt="1em" fontStyle={"italic"}>{t("Job done?")}</Text>
                </Box>
              </>
            }
            {/* Actions Mark Job as Done */}

            {
              (deal || {}).deal.dealStatus === ONGOING_STATUS && orderDetail.orderCompletedBySeller && (
                <>
                  <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                  <Text fontWeight={600} fontSize="2xl">{t("Actions")}</Text>
                  <Text fontWeight={"normal"} fontStyle={"italic"}>{t("Work ready and has already been notified")}</Text>
                </>
              )}

            <Stack mt={4} direction={'row'} spacing={2}>
              <Box w="full">
                {(deal || {}).deal.dealStatus === CLAIMED_STATUS && verifyMessages && (
                  <>
                    <Divider orientation='horizontal' mt="1em" mb="1em" bg="gray.400" />
                    <Text fontWeight={600} fontSize="2xl">{t("Actions")}</Text>
                    <SimpleGrid columns={{ base: 0, md: 2 }} spacing={10}>
                      <Box p="1em" position="relative" minHeight="170px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <Text color="black">
                            {t("If you agree with the claim made by the buyer, you can choose to make a refund according to the amount required")}
                          </Text>
                        </div>
                        <div>
                          <Box mt="2em" width="100%" textAlign={{ base: "center", md: "left" }}>
                            <ButtonPayOrder
                              transactionInfo={{
                                claimId: (deal || {}).claim.claimID,
                                transactionHash: transactionMeta.transactionHash
                              }}
                              amount={transactionPayedAmount || '0'}
                              stepsPostAction={loadOrder}
                              toggleLoadingStatus={toggleLoadingStatus}
                              yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance}
                              isSeller={true}
                              t={t}
                            />
                          </Box>
                        </div>
                      </Box>
                      <Box bg='orange.200' p="1em" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <Text color="black">
                            {
                              !isLateToChallenge &&
                              t("Dispute claim")
                            }
                            {
                              isLateToChallenge &&
                              t("You cannot challenge the claim of the order because the status of this transaction has expired.")
                            }
                          </Text>
                        </div>
                        <div>
                          {
                            !isLateToChallenge &&
                            <Box mt="1em" textAlign={{ base: "center", md: "right" }}>
                              <ButtonChallengeClaim
                                transactionInfo={{
                                  claimID: (deal || {}).claim.claimID,
                                  transactionHash: transactionMeta.transactionHash,

                                }}
                                stepsPostAction={loadOrder}
                                evidenceID={evidence && evidence._id}
                                toggleLoadingStatus={toggleLoadingStatus}
                                yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance} t={t}
                              />
                            </Box>
                          }
                        </div>
                      </Box>
                    </SimpleGrid>

                  </>
                )}

                {
                  (deal || {}).deal.isOver && orderDetail.orderCompletedBySeller && verifyMessages && (deal || {}).deal.dealStatus !== "4" && (
                    <>
                      <ButtonCloseDeal
                        dealId={(deal || {}).deal.dealId}
                        transactionHash={transactionMeta.transactionHash}
                        toggleLoadingStatus={toggleLoadingStatus}
                        yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance}
                        stepsPostAction={loadOrder}
                        t={t}
                      />

                      <Text mt="5px" fontWeight={"normal"} fontStyle={"italic"}>
                        {t("Time to claim exhausted")}
                      </Text>
                    </>
                  )
                }

              </Box>
            </Stack>
          </Box>
        </Center>
      </Container>
    </>
  )
}

export default OrderDetail
