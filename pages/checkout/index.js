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
  ModalCloseButton,
  useDisclosure,
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
import useUser from '../../hooks/data/useUser';
import Loading from '../../components/Spinners/Loading';

const Checkout = () => {
  const global = useGlobal();
  const dispatch = useDispatchGlobal();
  const router = useRouter();
  const [orderData, setOrderData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [operationInProgress, setOperationInProgress] = useState(false);

  const { user, loggedOut } = useUser()

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/')
      dispatch({
        type: 'AUTHPROFILE',
        payload: null,
      })
    }
  }, [user, loggedOut, router, dispatch]);


  const [sliderValue, setSliderValue] = useState(0)

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

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
      onOpen()
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
              <Text mt="3" fontStyle="italic">
                Set the % on top of the total price that you want to get burned. This will favor the token by increasing its price.
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
                  currency={(orderData.item || {}).currencySymbolPrice || 'ETH'}
                  burnFee={sliderValue}
                  yubiaiPaymentArbitrableInstance={global.yubiaiPaymentArbitrableInstance}
                />
              </Stack>
            </Box>
          </Center>
        </Box>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef} scrollBehavior={'inside'} size={"xl"}>
          <OverlayOne />
          <ModalContent bg="white" color="black">
            <ModalHeader>Terms Checkout</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            </ModalBody>

            <ModalFooter>
              <Button onClick={() => {
                router.push("/")
                onClose()
              }}>Reject</Button>

              <Button colorScheme='blue' mr={3} onClick={() => onClose()}>
                Accept
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  )
}

export default Checkout
