import { Box, Button, Flex, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatchGlobal } from "../../providers/globalProvider";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { channelService } from "../../services/channelService";
import TimeForServiceInfo from "../Infos/TimeForServiceInfo";
import TimeForClaimInfo from "../Infos/TimeForClaimInfo";
import { convertTimeToReadable } from "../../utils/itemUtils";


const BuyConfigCard = ({ channel, profile, update, t }) => {
    const router = useRouter();
    const dispatch = useDispatchGlobal();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const [editSettings, setEditSettings] = useState(false);

    const [selectedTypePrice, setSelectedTypePrice] = useState('');

    // Input Number config
    const format = (val) => val
    const parse = (val) => val.replace(/^\$/, '')
    const [priceValue, setPriceValue] = useState('')

    const [timeForServiceValue, setTimeForServiceValue] = useState('');
    const [timeForClaimValue, setTimeForClaimValue] = useState('');

    const { handleSubmit, reset } = useForm()

    useEffect(() => {
        reset(channel)
    }, [])


    const onCancel = async () => {
        try {
            setIsLoading(true)
            await channelService.updateSettings({
                _id: channel._id,
                priceconfig: null,
                time_for_service: null,
                time_for_claim: null
            }, profile.token)
            reset();
            update();
            setEditSettings(false);
            setTimeout(() => {
                toast({
                    title: t('Settings'),
                    description: t('Removed Settings'),
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


    const buyAndCheckoutItem = async () => {
        const res = await update();

        if (res && res.status === true && res.priceconfig) {
            const itemConfig = {
                ...channel.item_id,
                seller: channel.seller,
                price: channel.priceconfig,
                time_for_service: channel.time_for_service,
                time_for_claim: channel.time_for_claim,
                typeprice: channel.typeprice
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
            console.log(timeForServiceValue, timeForClaimValue, "times")
            setIsLoading(true)
            await channelService.updateSettings({
                _id: channel._id,
                typeprice: selectedTypePrice,
                priceconfig: priceValue,
                time_for_service: timeForServiceValue,
                time_for_claim: timeForClaimValue
            }, profile.token);

            reset();
            update();
            setEditSettings(false);
            setTimeout(() => {
                toast({
                    title: t('Added New Settings'),
                    description: t('Save'),
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
                description: t('Failed to save'),
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

    if (channel && channel.order_id === null && channel.status == true) {
        return (
            <>
                <Box mt="2em">
                    {profile._id === channel.seller._id && (
                        <>
                            {!editSettings && channel?.priceconfig && (
                                <>
                                    <Flex>
                                        <Text fontWeight={"bold"} mt="9px">{t("Settings")}</Text>
                                    </Flex>
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Text mt="10px" fontSize="0.9em">{t("New Price")}: {channel.priceconfig} {channel.item_id.currencySymbolPrice} ({t(`${channel.typeprice}`)})</Text>
                                            <Text mt="10px" fontSize="0.9em"><TimeForServiceInfo t={t} /> {t("Time For Service")}: {convertTimeToReadable(channel.time_for_service, t)} </Text>
                                            <Text mt="10px" fontSize="0.9em"><TimeForClaimInfo t={t} /> {t("Time For Claim")}: {convertTimeToReadable(channel.time_for_claim, t)} </Text>
                                            <Flex mt="1em" justifyContent={"space-between"}>
                                                <Button bg="green.300" ml="5px" onClick={() => setEditSettings(true)}><EditIcon></EditIcon></Button>
                                                <Button bg="red.300" ml="5px" onClick={() => onCancel()}><DeleteIcon></DeleteIcon></Button>
                                            </Flex>
                                        </>
                                    )}

                                </>
                            )}

                            {!editSettings && !channel?.priceconfig && !isLoading && (
                                <>
                                    <Button
                                        bg="green.400"
                                        color="white"
                                        w="100%"
                                        fontSize={'16px'}
                                        fontWeight={'600'}
                                        onClick={() => setEditSettings(true)}
                                        _hover={{ bg: 'green.500' }}
                                    >
                                        {t("Added New Settings")}
                                    </Button>
                                </>
                            )}
                            {editSettings && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl isRequired mt="1em">
                                        <FormLabel color="black">{t("New Price")}</FormLabel>
                                        <Select
                                            bg="white"
                                            color="black"
                                            name="typeprice"
                                            id="typeprice"
                                            mt="1em"
                                            placeholder={t("Select Type")}
                                            onChange={(e) => {
                                                setSelectedTypePrice(e.target.value)
                                            }}
                                        >
                                            <option
                                                key="Hourly rate"
                                                value="Hourly rate"
                                                id="Hourly rate"
                                            >
                                                {t("Hourly rate")}
                                            </option>
                                            <option
                                                key="Total"
                                                value="Total"
                                                id="Total"
                                            >
                                                Total
                                            </option>
                                        </Select>
                                        <NumberInput
                                            onChange={(valueString) => {
                                                setPriceValue(parse(valueString))
                                                return
                                            }}
                                            value={format(priceValue)}
                                            color="gray.700"
                                            bg="white"
                                            mt="1em"
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
                                    <FormControl isRequired mt="1em">
                                        <FormLabel color="black"><TimeForServiceInfo t={t} /> {t("Time For Service")} </FormLabel>
                                        <NumberInput
                                            onChange={(valueString) => {
                                                setTimeForServiceValue(parse(valueString))
                                                return
                                            }}
                                            value={format(timeForServiceValue)}
                                            color="gray.700"
                                            bg="white"
                                            min={1}
                                            max={60}
                                            precision={1}
                                            isRequired
                                        >
                                            <NumberInputField placeholder='Min: 1 - Max: 60 days' _placeholder={{ color: 'gray.400' }}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                    {timeForServiceValue > 0 && (
                                        <Box mt="5px">
                                            {convertTimeToReadable(timeForServiceValue, t)}
                                        </Box>
                                    )}
                                    <FormControl isRequired mt="1em">
                                        <FormLabel color="black"> <TimeForClaimInfo t={t} /> {t("Time For Claim")}  </FormLabel>
                                        <NumberInput
                                            onChange={(valueString) => {
                                                setTimeForClaimValue(parse(valueString))
                                                return
                                            }}
                                            value={format(timeForClaimValue)}
                                            color="gray.700"
                                            bg="white"
                                            min={1}
                                            max={10}
                                            precision={1}
                                            isRequired
                                        >
                                            <NumberInputField placeholder='Min: 1 - Max: 10 days' _placeholder={{ color: 'gray.400' }}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                    {timeForClaimValue > 0 && (
                                        <Box mt="5px">
                                            {convertTimeToReadable(timeForClaimValue, t)}
                                        </Box>
                                    )}
                                    <Button mt="1em" w="100%" bg="#00abd1" color="white" type="submit">
                                        {t("Save")}
                                    </Button>
                                </form>
                            )}
                        </>
                    )}
                    {profile._id === channel.buyer._id && channel.priceconfig && (
                        <>
                            <Text fontWeight={"bold"}>{t("Settings")}</Text>
                            <Text mt="10px" fontSize="0.9em">{t("New Price")}: {channel.priceconfig} {channel.item_id.currencySymbolPrice} ({t(`${channel.typeprice}`)})</Text>
                            <Text mt="10px" fontSize="0.9em"><TimeForServiceInfo t={t} /> {t("Time For Service")}: {convertTimeToReadable(channel.time_for_service, t)} </Text>
                            <Text mt="10px" fontSize="0.9em"><TimeForServiceInfo t={t} /> {t("Time For Claim")}: {convertTimeToReadable(channel.time_for_claim, t)}</Text>
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