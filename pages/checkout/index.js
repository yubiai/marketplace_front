import {
  Box,
  Text,
  Heading,
  Center,
  Avatar,
  Stack,
  AlertIcon,
  Alert,
  Divider,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

import ButtonCheckout from '../../components/Buttons/ButtonCheckout';
import { useGlobal, useDispatchGlobal } from '../../providers/globalProvider';
import {
  loadOrderData,
} from '../../providers/orderProvider';
import { orderService } from '../../services/orderService';
import { channelService } from '../../services/channelService';

import useUser from '../../hooks/data/useUser';
import Loading from '../../components/Spinners/Loading';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useNetwork } from 'wagmi';

const Checkout = () => {
  const global = useGlobal();
  const toast = useToast();
  const dispatch = useDispatchGlobal();
  const router = useRouter();
  const { t } = useTranslation("checkout");
  const [orderData, setOrderData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [operationInProgress, setOperationInProgress] = useState(false);
  const { address } = useAccount();
  
  const { user, loggedOut } = useUser();

  const [priceType, setPriceType] = useState("");

  const { chain } = useNetwork()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch]);

  const sliderValue = 0;

  useEffect(() => {

    const loadOrder = async () => {
      const result = await loadOrderData(
        { ...global.itemToCheckout },
        chain.nativeCurrency.symbol
      )
      const { orderInfo, transaction, time_for_claim, time_for_service, typeprice } = result
      setPriceType(typeprice);
      setOrderData(orderInfo)
      console.log(orderInfo, "orderInfo")
      let neWtransaction = {
        ...transaction,
        time_for_claim,
        time_for_service,
        typeprice
      }
      console.log(neWtransaction, "neWtransaction")
      setTransactionData(neWtransaction)
    };

    if(global && global.itemToCheckout && chain && chain.nativeCurrency && global.itemToCheckout.currencySymbolPrice == chain.nativeCurrency.symbol){
      loadOrder();
    }

  }, [])

  const createOrder = async (transactionResult) => {
    const currentWalletAccount = address;
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
        buyer: buyerId,
        seller: sellerId,
        item_id: orderData.item._id,
        order_id: orderId
      },
      global.profile.token
    )

    console.log(transactionResult.transactionMeta.transactionHash, "transactionResult.transactionMeta.transactionHash")
    router.push(`/profile/orders/detail/${transactionResult.transactionMeta.transactionHash}`);
    return
  }

  const toggleLoadingStatus = (status) => {
    setOperationInProgress(status)
  }

  if (!user) return <Loading />

  return (
    transactionData && (
      <>
        <Head>
          <title>Yubiai Marketplace - Search Item</title>
          <meta
            name="keywords"
            content="yubiai, market, marketplace, crypto, eth, poh, metamask"
          />
        </Head>
        <Container
          maxW="6xl"
          h={"100vh"}
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
                {t("Order summary")}
              </Heading>
              <Text fontWeight={600} color={'gray.500'}>
                {t("Price")}: {orderData.item && orderData.item.price}{' '}
                {orderData.item && orderData.item.currencySymbolPrice}
              </Text>
              <Text fontWeight={400} color="gray.500" mb={4}>{priceType}
              </Text>
              <Text textAlign={'center'} color={'gray.700'} px={3}>
                {orderData.item && orderData.item.title}
              </Text>
              <Divider mt="1em" />

              <Alert status="warning" mt="1em" color="black" bg="orange.100">
                <AlertIcon color="orange" />
                {t("When you click on &apos;Hire service&apos;, your payment will be held and it will be released to the seller when you get the service")}{' '}
              </Alert>
              <Stack mt={8}>
                <ButtonCheckout
                  addressAccount={address}
                  transactionInfo={transactionData}
                  toggleLoadingStatus={toggleLoadingStatus}
                  createOrder={createOrder}
                  operationInProgress={operationInProgress}
                  currency={orderData?.item?.currencySymbolPrice}
                  burnFee={sliderValue}
                  chain={chain}
                  router={router}
                  toast={toast}
                  t={t}
                />
              </Stack>
            </Box>
          </Center>
        </Container>
      </>
    )
  )
}

export default Checkout
