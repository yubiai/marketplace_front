import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, /* Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, */ Spinner, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatchGlobal, useGlobal } from "../../providers/globalProvider";
import { loadCurrencyPrices, setYubiaiInstance } from "../../providers/orderProvider";
import { itemService } from "../../services/itemService";


const PriceItemEdit = ({ item, token, mutate, t }) => {
    const global = useGlobal();
    const dispatch = useDispatchGlobal();
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    const [actionEdit, setActionEdit] = useState(false);
    const { handleSubmit, reset } = useForm();

    // Input Price config
    const format = (val) => val
    const parse = (val) => val.replace(/^\$/, '')

    const [priceValue, setPriceValue] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('ETH')
    const [sliderValue, setSliderValue] = useState(0)

    // Load Currencies
    const loadCurrencies = async () => {
        const networkType = await global.yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType();
        loadCurrencyPrices(dispatch, global, networkType);
    }

  /*   const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    } */

    const onEdit = async () => {

        setLoading(true)

        if (!global.yubiaiPaymentArbitrableInstance) {
            await setYubiaiInstance(dispatch);
        }

        if (global.yubiaiPaymentArbitrableInstance && global.currencyPriceList.length) {
            setActionEdit(true);
            setLoading(false)
        }

        return
    }

    useEffect(() => {

        if (!global.currencyPriceList.length && global.profile && global.yubiaiPaymentArbitrableInstance) {
            loadCurrencies();
            setActionEdit(true);
            setLoading(false)
        }

    }, [global.yubiaiPaymentArbitrableInstance])

    const onSubmit = async () => {
        const newData = {
            currencySymbolPrice: selectedCurrency,
            price: priceValue,
            ubiburningamount: sliderValue
        }
        await itemService.updateItemById(item._id, newData, token);
        toast({
            title: t("Edit Item"),
            description: t("Data Saved successfully."),
            position: 'top-right',
            status: 'success',
            duration: 3000,
            isClosable: true
        });
        mutate()
        setPriceValue('');
        setSelectedCurrency('ETH');
        setSliderValue(0);
        reset();
        setActionEdit(false);
    }

    return (
        <>
            <Flex mt="10px" p="5px"
            >
                <Text mt="10px" fontStyle={"italic"} fontWeight={"semibold"}>{t("Price Edit")}</Text>
                <Flex justifyContent='left' m="5px">
                    {actionEdit && (
                        <ButtonGroup justifyContent='center' size='sm'>
                            <IconButton icon={<CloseIcon />} onClick={() => setActionEdit(false)} />
                        </ButtonGroup>
                    )}
                    {!actionEdit && (<IconButton size='sm' icon={<EditIcon />} onClick={() => onEdit(true)} />
                    )}

                </Flex>
            </Flex>
            {loading && (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                />
            )}
            {!actionEdit && (<Text p="5px"
            >{t("Currency:")} {item.currencySymbolPrice} {" - "} {t("Price:")} {item.price} {item.currencySymbolPrice}</Text>)}
            {actionEdit && global.currencyPriceList && global.currencyPriceList.length > 0 && (
                <>
                    <Box h="full" p="5px"
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {global.currencyPriceList && global.currencyPriceList.length > 0 && (
                                <FormControl isRequired mt="1em">
                                    <FormLabel color="black">{t("Currency")}</FormLabel>
                                    <Select
                                        bg="white"
                                        color="black"
                                        name="currency"
                                        id="currency"
                                        placeholder={t("Select Currency")}
                                        onChange={(e) => {
                                            setSelectedCurrency(e.target.value)
                                        }}
                                    >
                                        {global.currencyPriceList.map((currency) => (
                                            <option
                                                key={currency._id}
                                                value={currency.symbol}
                                                id="currency"
                                            >
                                                {currency.symbol}
                                            </option>
                                        ))}

                                    </Select>
                                </FormControl>
                            )}
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black">{t("Amount")}</FormLabel>
                                <NumberInput
                                    onChange={(valueString) => setPriceValue(parse(valueString))}
                                    value={format(priceValue)}
                                    color="gray.700"
                                    bg="white"
                                    min={0.00001}
                                    max={999999}
                                    isRequired
                                >
                                    <NumberInputField placeholder='0.001' _placeholder={{ color: 'gray.400' }}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            {/* <Box color="gray.700"
                            >
                                <FormControl isRequired mt="1em" >
                                    <FormLabel color="black">{t("UBI Burning Amount")}</FormLabel>
                                    <Text fontStyle={"italic"}>{t("Remember that the amount to be burned will be deducted from the final sale price")}.</Text>
                                    <Box pr={"1em"} pl={"1em"} w={{ base: "full", md: "50%" }}>
                                        <Slider
                                            mt="3em"
                                            aria-label="slider-ex-6"
                                            defaultValue={2}
                                            min={0.6}
                                            max={10}
                                            onChange={(val) => setSliderValue(val)}
                                        >
                                            <SliderMark value={0.6} {...labelStyles}>
                                                0.6%
                                            </SliderMark>
                                            <SliderMark value={2} {...labelStyles}>
                                                <Flex>2% <Text fontStyle={"italic"} ml="5px">{t("Recommended")}</Text></Flex>
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
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb />
                                        </Slider>
                                    </Box>
                                </FormControl>
                            </Box> */}
                            <Button mt="3em" bg="#00abd1" color="white" type="submit">
                                {t("Update")}
                            </Button>
                        </form>
                    </Box>
                </>
            )}
        </>
    )
}

export default PriceItemEdit;