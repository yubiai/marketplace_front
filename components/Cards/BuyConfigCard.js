import { Box, Button, Flex, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatchGlobal } from "../../providers/globalProvider";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { channelService } from "../../services/channelService";


const BuyConfigCard = ({ channel, profile, update, t }) => {
    const router = useRouter();
    const dispatch = useDispatchGlobal();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const [editNewPrice, setEditNewPrice] = useState(false);

    // Input Price config
    const format = (val) => val
    const parse = (val) => val.replace(/^\$/, '')
    const [priceValue, setPriceValue] = useState('')

    const { handleSubmit, reset } = useForm()

    const onCancel = async () => {
        try {
            setIsLoading(true)
            await channelService.updatePriceConfig({
                _id: channel._id,
                priceconfig: null
            }, profile.token)
            reset();
            update();
            setEditNewPrice(false);
            setTimeout(() => {
                toast({
                    title: 'New price',
                    description: 'Cancelled',
                    position: 'top-right',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true
                })
                setIsLoading(false);
            }, 2000);
            return
        } catch (error) {
            console.error(error);
            setIsLoading(false)
            return
        }
    }


    const buyAndCheckoutItem = async() => {
        const res = await update();

        if (res && res.status === true && res.priceconfig) {
            const itemConfig = {
                ...channel.item_id,
                seller: channel.seller,
                price: channel.priceconfig
            }

            dispatch({
                type: 'SET_ITEM_TO_CHECKOUT',
                payload: itemConfig
            })
            router.push('/checkout')
        } else {
            toast({
                title: 'Error',
                description: 'Error Chat',
                position: 'top-right',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
        }
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            await channelService.updatePriceConfig({
                _id: channel._id,
                priceconfig: priceValue
            }, profile.token);

            reset();
            update();
            setEditNewPrice(false);
            setTimeout(() => {
                toast({
                    title: 'New price',
                    description: 'Saved',
                    position: 'top-right',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                })
                setIsLoading(false);
            }, 2000);
            return
        } catch (err) {
            console.error(err);
            toast({
                title: 'Error',
                description: 'New Price Error',
                position: 'top-right',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return
        }
    }

    if (channel && channel.order_id === null) {
        return (
            <>
                <Box mt="2em">
                    {profile._id === channel.seller._id && (
                        <>
                            {!editNewPrice && channel?.priceconfig && (
                                <>
                                    <Text>{t("New Price")}</Text>
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Flex>
                                                <Text mt="10px">{channel.priceconfig} {channel.item_id.currencySymbolPrice}</Text>
                                                <Button ml="5px" onClick={() => setEditNewPrice(true)}><EditIcon></EditIcon></Button>
                                                <Button ml="5px" onClick={() => onCancel()}><DeleteIcon></DeleteIcon></Button>
                                            </Flex>

                                        </>
                                    )}

                                </>
                            )}

                            {!editNewPrice && !channel?.priceconfig && !isLoading && (
                                <>
                                    <Button
                                        bg="green.400"
                                        color="white"
                                        w="100%"
                                        mt="1em"
                                        fontSize={'16px'}
                                        fontWeight={'600'}
                                        onClick={() => setEditNewPrice(true)}
                                        _hover={{ bg: 'green.500' }}
                                    >
                                        {t("Added New Price")}
                                    </Button>
                                </>
                            )}
                            {editNewPrice && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl isRequired mt="1em">
                                        <FormLabel color="black">New Price</FormLabel>
                                        <NumberInput
                                            onChange={(valueString) => {
                                                setPriceValue(parse(valueString))
                                                return
                                            }}
                                            value={format(priceValue)}
                                            color="gray.700"
                                            bg="white"
                                            min={0.00001}
                                            max={999999}
                                            precision={5}
                                            isRequired
                                        >
                                            <NumberInputField placeholder='0.00001' _placeholder={{ color: 'gray.400' }}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                    <Button mt="1em" w="100%" bg="#00abd1" color="white" type="submit">
                                        {t("Save")}
                                    </Button>
                                </form>
                            )}
                        </>
                    )}
                    {profile._id === channel.buyer._id && channel.priceconfig && (
                        <>
                            <Text>{t("New Price")}</Text>
                            <Flex>
                                <Text mt="10px">{channel.priceconfig} {channel.item_id.currencySymbolPrice}</Text>
                            </Flex>
                            <Button
                                bg="#00abd1"
                                color="white"
                                w="100%"
                                mt="1em"
                                fontSize={'16px'}
                                fontWeight={'600'}
                                onClick={() => buyAndCheckoutItem()}
                            >
                                {t("Buy Now")}
                            </Button>
                        </>
                    )}

                </Box>
            </>
        )
    } else null;

}

export default BuyConfigCard;