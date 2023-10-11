import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, /* Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, */ Spinner, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { itemService } from "../../services/itemService";
import { useNetwork } from "wagmi";

const PriceItemEdit = ({ item, token, mutate, t }) => {
    const toast = useToast();

    // Chains
    const { chains } = useNetwork()

    const [selectedTypePrice, setSelectedTypePrice] = useState('');

    const [loading, setLoading] = useState(false);

    const [actionEdit, setActionEdit] = useState(false);
    const { handleSubmit, reset } = useForm();

    // Input Price config
    const format = (val) => val
    const parse = (val) => val.replace(/^\$/, '')

    const [priceValue, setPriceValue] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('ETH')
    const [sliderValue, setSliderValue] = useState(0)


    /*   const labelStyles = {
          mt: '2',
          ml: '-2.5',
          fontSize: 'sm',
      } */

    const onEdit = async () => {

        setLoading(true)

        if (chains && chains.length > 0) {
            setActionEdit(true);
            setLoading(false)
        }

        return
    }

    const onSubmit = async () => {
        const newData = {
            currencySymbolPrice: selectedCurrency,
            typeprice: selectedTypePrice,
            price: selectedTypePrice && selectedTypePrice != "To settle" ? priceValue : 888888,
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
            >{t("Currency:")} {item.currencySymbolPrice} {" - "} {t("Price:")} {item.typeprice && item.typeprice != "To settle" ? item.price + " " + item.currencySymbolPrice : ""} {t(`(${item.typeprice})`)}</Text>)}
            {actionEdit && chains && chains.length > 0 && (
                <>
                    <Box h="full" p="5px"
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {chains && chains.length > 0 && (
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
                                        {chains.map((currency) => (
                                            <option
                                                key={currency._id}
                                                value={currency.nativeCurrency.symbol}
                                                id="currency"
                                            >
                                                {currency.name} - {currency.nativeCurrency.symbol}
                                            </option>
                                        ))}

                                    </Select>
                                </FormControl>
                            )}
                            <FormControl isRequired mt="1em">
                                <FormLabel color="black">{t("Amount")}</FormLabel>
                                <Select
                                    bg="white"
                                    color="black"
                                    name="typeprice"
                                    id="typeprice"
                                    placeholder={t("Select Type")}
                                    onChange={(e) => {
                                        setSelectedTypePrice(e.target.value)
                                    }}
                                >
                                    <option
                                        key="To settle"
                                        value="To settle"
                                        id="To settle"
                                    >
                                        {t("To settle")}
                                    </option>
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
                                {selectedTypePrice && selectedTypePrice != "To settle" && (
                                    <NumberInput
                                        onChange={(valueString) => setPriceValue(parse(valueString))}
                                        value={format(priceValue)}
                                        color="gray.700"
                                        bg="white"
                                        mt="1em"
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
                                )}
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