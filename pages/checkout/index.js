import { Avatar, Box, Center, Container, Divider, Heading, Stack, Text, Alert, AlertIcon, Button, useToast, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { useRouter } from "next/router";
import useUser from "../../hooks/data/useUser";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { getBlockExplorerForNetwork, getContractsForNetwork } from "../../utils/walletUtils";
import { yubiaiArbitrable } from "../../utils/escrow-utils/abis";
import { loadOrderData } from "../../providers/orderProvider";
import { ethers } from "ethers";
import Loading from "../../components/Spinners/Loading";
import { orderService } from "../../services/orderService";
import { channelService } from "../../services/channelService";
import { formatDayBySeconds } from "../../utils/orderUtils";
import useTranslation from 'next-translate/useTranslation';

const Checkout = () => {
    const global = useGlobal();
    const toast = useToast();
    const dispatch = useDispatchGlobal();
    const router = useRouter();
    const [orderData, setOrderData] = useState({});
    const [transactionData, setTransactionData] = useState({});
    const [priceType, setPriceType] = useState("");
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [messageError, setMessageError] = useState(null);

    const { t } = useTranslation("checkout");

    const termsUrl = process.env.NEXT_PUBLIC_TERMS_URL_DEFAULT;

    //Errors
    const messageErrorCost = "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account";

    const { user, loggedOut } = useUser();
    // if logged in, redirect to the home
    useEffect(() => {
        if (loggedOut) {
            router.replace('/logout')
        }
    }, [user, loggedOut, router, dispatch]);

    const { chain } = useNetwork()
    const { address, connector } = useAccount();
    console.log("addressaddress", address)
    const networkType = chain.name.toLowerCase();
    console.log(networkType, "networkType")
    const networkData = getBlockExplorerForNetwork(networkType);
    const blockExplorer = networkData.blockExplorer;
    const yubiaiContract = getContractsForNetwork(networkType);
    console.log(yubiaiContract, "yubiaiContract")
    const [amountToWeiOrder, setAmountToWeiOrder] = useState();
    const [timeForClaim, setTimeForClaim] = useState();
    const [timeForService, setTimeForService] = useState();

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

        router.push(`/profile/orders/detail/${transactionResult.transactionMeta.transactionHash}`);
        return
    }

    const { data, isLoading: isLoadingWrite, write } = useContractWrite({
        address: yubiaiContract.yubiaiArbitrable,
        abi: yubiaiArbitrable,
        functionName: 'createDealWithValue',
        account: address,
        onError(error) {
            console.log(error, "error")
            setMessageError(error.message);
            toast({
                id: "Error metamask",
                title: 'Error Checkout',
                description: error.name,
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        },
    });

    // Use Wait for transaction
    const { isLoading } = useWaitForTransaction({
        hash: data?.hash,
        async onSuccess(data) {
            setMessageError(null);
            setLoadingCheckout(true);
            const decodedEvent = ethers.utils.defaultAbiCoder.decode(
                [
                    'uint64'
                ],
                data.logs[connector.id == "metaMask" ? 1 : 2].topics[1]
            );

            // Data para Crear la order
            const dealId = decodedEvent[0].toNumber();
            const {
                blockHash,
                blockNumber,
                cumulativeGasUsed,
                effectiveGasPrice,
                from,
                to,
                transactionHash
            } = data;

            const transactionPayedAmount = amountToWeiOrder.toString();

            const transactionFeeAmount = "0";

            const blockNumberString = blockNumber.toString();
            const cumulativeGasUsedString = cumulativeGasUsed.toString();
            const effectiveGasPriceString = effectiveGasPrice.toString();

            await createOrder({
                from,
                to,
                transactionMeta: {
                    transactionHash,
                    blockHash,
                    blockNumberString,
                    cumulativeGasUsedString,
                    effectiveGasPriceString,
                    contractAddressURI: `${blockExplorer}/address/${yubiaiContract.yubiaiArbitrable}`
                },
                transactionState: parseInt(1, 10),
                claimCount: parseInt(0, 10),
                timeForService: parseInt(timeForService, 10),
                timeForClaim: parseInt(timeForClaim, 10),
                currentClaim: parseInt(0, 10),
                typeprice: priceType,
                transactionIndex: dealId.toString(),
                transactionPayedAmount,
                transactionFeeAmount,
                transactionDate: Math.floor((new Date()).getTime() / 1000),
                networkEnv: networkType
            });

            return;
        },
        onError(error) {
            console.error(error, "error")
            setMessageError(error.message);
            toast({
                id: "Error metamask",
                title: 'Error Checkout',
                description: error.name,
                position: 'top-right',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setLoadingCheckout(false);
            return;
        }
    });

    useEffect(() => {

        const loadOrder = async () => {
            const result = await loadOrderData(
                { ...global.itemToCheckout },
                chain.nativeCurrency.symbol
            )
            const { orderInfo, transaction, time_for_claim, time_for_service, typeprice } = result
            setPriceType(typeprice);
            setOrderData(orderInfo)

            let neWtransaction = {
                ...transaction,
                time_for_claim,
                time_for_service,
                typeprice
            }
            setTransactionData(neWtransaction);
        };

        if (global && global.itemToCheckout && chain && chain.nativeCurrency && global.itemToCheckout.currencySymbolPrice == chain.nativeCurrency.symbol) {
            loadOrder();
        } else {
            router.back();
        }

    }, []);


    // Hire service
    const onCheckOut = () => {
        try {

            if (transactionData) {

                const { amount, recipient, time_for_claim, time_for_service } = transactionData;
                const amountToWei = ethers.utils.parseEther(amount.value.toString(), "ether");
                setAmountToWeiOrder(Number(amountToWei));
                setTimeForService(time_for_service ? formatDayBySeconds(time_for_service) : process.env.NEXT_PUBLIC_TIME_FOR_SERVICE);

                setTimeForClaim(time_for_claim ? formatDayBySeconds(time_for_claim) : process.env.NEXT_PUBLIC_TIME_FOR_CLAIM);
                console.log("Aca esta el address?" + address);
                write({
                    args: [
                        [
                            Number(amountToWei),
                            address,
                            0,
                            0,
                            0,
                            0,
                            recipient,
                            Math.floor((new Date()).getTime() / 1000),
                            time_for_service ? formatDayBySeconds(time_for_service) : process.env.NEXT_PUBLIC_TIME_FOR_SERVICE,
                            time_for_claim ? formatDayBySeconds(time_for_claim) : process.env.NEXT_PUBLIC_TIME_FOR_CLAIM,
                            networkData.token_address,
                            0,
                            0
                        ], termsUrl
                    ],
                    value: Number(amountToWei)
                })
            }
            return

        } catch (error) {
            console.error(error);
            setLoadingCheckout(false);
            return
        }
    }


    if (global && !global.itemToCheckout || !orderData || !transactionData) return <Loading />

    return (
        <>
            <Head>
                <title>Yubiai Marketplace - Checkout</title>
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
                {messageError && (
                    <Alert status="error" mt="1em" color="black" bg="red.100">
                        <AlertIcon color="red" />
                        {messageError.startsWith(messageErrorCost) ? (
                            t("The balance")
                        ) : messageError}
                    </Alert>
                )}
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
                        <Text fontWeight={400} color="gray.500" mb={4}>{priceType}                         </Text>
                        <Text textAlign={'center'} color={'gray.700'} px={3}>
                            {orderData.item && orderData.item.title}
                        </Text>
                        <Divider mt="1em" />

                        <Alert status="warning" mt="1em" color="black" bg="orange.100">
                            <AlertIcon color="orange" />
                            {t("When you click")}
                        </Alert>
                        <Stack mt={8}>
                            {loadingCheckout || isLoadingWrite || isLoading && (
                                <Center >
                                    <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="md"
                                    />
                                </Center>
                            )}
                            <Button bg='#00abd1' color={'white'} onClick={() => onCheckOut()} isDisabled={loadingCheckout || isLoadingWrite || isLoading}>{t("Hire service")}</Button>
                        </Stack>

                    </Box>
                </Center>
            </Container>
        </>
    )
}

export default Checkout;