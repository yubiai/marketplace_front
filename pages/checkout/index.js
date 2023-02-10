import {
  Box,
  Text,
  Heading,
  Center,
  Button,
  Avatar,
  Stack,
  AlertIcon,
  Alert,
  SliderThumb,
  SliderFilledTrack,
  SliderTrack,
  SliderMark,
  Slider,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  useToast,
  Spinner,
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

import ButtonCheckout from '../../components/Buttons/ButtonCheckout';
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider';
import {
  loadCurrencyPrices,
  loadOrderData,
  setYubiaiInstance,
} from '../../providers/orderProvider';
import { orderService } from '../../services/orderService';
import { channelService } from '../../services/channelService';
import { termService } from '../../services/termService';

import useUser from '../../hooks/data/useUser';
import Loading from '../../components/Spinners/Loading';
import RichTextReadOnly from '../../components/Utils/richTextReadOnly';
import { profileService } from '../../services/profileService';

const Checkout = () => {
  const global = useGlobal();
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const router = useRouter();
  const [orderData, setOrderData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTerm, setLoadingTerm] = useState(false);

  const { user, loggedOut } = useUser()

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch]);


  const [sliderValue, setSliderValue] = useState(0)

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  const verifyTyC = async () => {

    try {
      // Get Last Terms
      const lastTerms = await termService.getTermsLast(global.profile && global.profile.token);
      // Get Profile Info
      const profileInfo = await profileService.getProfileFromId(global.profile._id, global.profile.token)

      if (!lastTerms) {
        router.back();
        return
      }

      if (!profileInfo) {
        router.back();
        return
      }

      // Check if in the profile you agree with this term
      const verifyTermProfile = profileInfo.data && profileInfo.data.terms.find((term) => term && term.idTerm == lastTerms.data._id);

      if (!verifyTermProfile) {
        setTerm(lastTerms.data)
        onOpen()
        return
      }

      setLoading(false)
      return
    } catch (err) {
      console.error(err);
      router.back();
      return
    }
  }

  // Confirm TyC
  const confirmTerms = async () => {
    try {
      setLoadingTerm(true)
      await profileService.addTerms(global.profile._id, term, global.profile.token);
      toast({
        title: 'Terms and conditions',
        description: 'You have accepted the terms and conditions.',
        position: 'top-right',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
      onClose();
      setLoadingTerm(false)
    } catch (err) {
      console.error(err);
      router.back();
      return
    }
  }

  // Reject TyC
  const rejectTerms = () => {
    setLoadingTerm(true)
    router.back();
    toast({
      title: 'Failed to checkout.',
      description: 'In order to initiate the transaction you must accept the terms and conditions.',
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    })
    onClose();
    return
  }

  useEffect(() => {
    const loadOrder = async () => {
      const result = await loadOrderData(
        { ...global.itemToCheckout },
        global.currencyPriceList
      )
      const { orderInfo, transaction } = result
      setOrderData(orderInfo)
      setTransactionData(transaction)
    };

    const loadCurrencies = async () => {
      const networkType = await global.yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType();
      loadCurrencyPrices(dispatch, global, networkType);
    };

    if (!global.yubiaiPaymentArbitrableInstance) {
      setYubiaiInstance(dispatch);
      return;
    }

    if (!global.currencyPriceList.length && (global.yubiaiPaymentArbitrableInstance || {}).web3) {
      loadCurrencies();
      return;
    }

    if (!global.itemToCheckout) {
      return;
    }

    if (!transactionData.extraData) {
      verifyTyC()
      loadOrder();
    }
  }, [transactionData, global.itemToCheckout, global.currencyPriceList, global.yubiaiPaymentArbitrableInstance])

  const createOrder = async (transactionResult = {}) => {
    const currentWalletAccount = await global.yubiaiPaymentArbitrableInstance.getAccount();
    const orderResponse = await orderService.createOrder(
      {
        order: {
          itemId: orderData.item._id,
          userBuyer: currentWalletAccount,
          userSeller: orderData.item.seller.eth_address,
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
    const sellerId = orderData.item.seller._id

    await channelService.createChannel(
      {
        order_id: orderId,
        buyer: buyerId,
        seller: sellerId,
      },
      global.profile.token
    )

    toggleLoadingStatus(false)
    router.push(`/profile/orders/detail/${transactionResult.transactionMeta.transactionHash}`)
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  // Overlay Modal
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.700'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  if (!user) return <Loading />

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
        maxW="6xl"
        h={{
          base: '100%',
          md: '100vh'
        }}
        display={'flex'}
        flexDirection={'column'}
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
                src={`${process.env.NEXT_PUBLIC_LINK_FLEEK && orderData.item && orderData.item.files && orderData.item.files[0] && process.env.NEXT_PUBLIC_LINK_FLEEK + orderData.item.files[0].filename}`}
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
                Price: {orderData.item && orderData.item.price}{' '}
                {(orderData.item && orderData.item.currencySymbolPrice) ||
                  'ETH'}
              </Text>
              <Text textAlign={'center'} color={'gray.700'} px={3}>
                {orderData.item && orderData.item.title}
              </Text>
              <Divider mt="1em" />

              {loading && (
                <Center mt="2em">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  />
                </Center>
              )}
              {!loading && (
                <>
                  <Center>
                    <Text mt="1em" fontStyle={"normal"} fontWeight={"bold"}>UBI Burning</Text>
                  </Center>
                  <Text mt="3" fontStyle="italic">
                    Set the desired percentage of $UBI to be burned on top of the total price. This will favor the token (UBI) by increasing its price.
                  </Text>
                  <Box pt={6} pb={2} mt="1em">
                    <Slider
                      color="black"
                      aria-label="slider-ex-6"
                      defaultValue={0}
                      min={0}
                      max={10}
                      onChange={(val) => setSliderValue(val)}
                    >
                      <SliderMark value={0} {...labelStyles}>
                        0%
                      </SliderMark>
                      <SliderMark value={5} {...labelStyles}>
                        5%
                      </SliderMark>
                      <SliderMark value={10} {...labelStyles}>
                        10%
                      </SliderMark>
                      <SliderMark
                        value={sliderValue}
                        textAlign="center"
                        bg="#00abd1"
                        color="white"
                        mt="-10"
                        ml="-5"
                        w="12"
                      >
                        {sliderValue}%
                      </SliderMark>
                      <SliderTrack bg='gray.400'>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb bg='blue.400' />
                    </Slider>
                  </Box>
                  <Alert status="warning" mt="1em" color="black" bg="orange.100">
                    <AlertIcon color="orange" />
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
                      currency={(orderData.item || {}).currencySymbolPrice}
                      burnFee={sliderValue}
                      yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance}
                    />
                  </Stack>
                </>
              )}
            </Box>
          </Center>
        </Container>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} scrollBehavior={'outside'} size={"6xl"}>
          <OverlayOne />
          <ModalContent bg="white" color="black">
            <ModalHeader>Terms and Conditions</ModalHeader>
            <ModalBody pb={6}>
              <RichTextReadOnly text={term && term.text} />
            </ModalBody>

            <ModalFooter>
              {!loadingTerm && (
                <>
                  <Button onClick={() => rejectTerms()} mr="1em">Reject</Button>

                  <Button colorScheme='blue' mr={3} onClick={() => confirmTerms()}>
                    Accept
                  </Button>
                </>
              )}
              {loadingTerm && (
                <Center mt="2em">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  />
                </Center>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  )
}

export default Checkout
