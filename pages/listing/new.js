import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  /*   Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack, */
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Error from '../../components/Infos/Error'
import PreviewItem from '../../components/Modals/PreviewItem'
import SuccessItem from '../../components/Modals/SuccessItem'
import Loading from '../../components/Spinners/Loading'
import FileUpload from '../../components/Utils/FileUpload'
import useFetch from '../../hooks/data/useFetch'
import useUser from '../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { publishService } from '../../services/publishService'
import { getListSubCategory } from '../../utils/itemUtils'
import { loadCurrencyPrices, setYubiaiInstance } from '../../providers/orderProvider'
import { ChevronRightIcon } from '@chakra-ui/icons'
import useTranslation from 'next-translate/useTranslation';
import Editor from '../../components/Editor/Editor'

const NewListing = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()
  const toast = useToast();
  const { t } = useTranslation("newlisting");
  const { lang } = useTranslation('common')

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedCurrency, setSelectedCurrency] = useState('ETH')

  // State SubCategories
  const [subCategories, setSubCategories] = useState([])

  // State useForm
  const { handleSubmit, register, getValues, control, formState: { errors }, resetField } = useForm()
  const [result, setResult] = useState(null)

  const [countTitle, setCountTitle] = useState(0);
  const MIN_TITLE_LENGTH = 15;
  const MAX_TITLE_LENGTH = 72;

  const [countDescription, setCountDescription] = useState(0);
  const MIN_DESCRIPTION_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 1600;

  // State Submit
  const [stateSubmit, setStateSubmit] = useState(0)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [dataSubmit, setDataSubmit] = useState(null)

  const sliderValue = 0;

  /* const [sliderValue, setSliderValue] = useState(0)

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  } */

  // Auth
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }

    const loadCurrencies = async () => {
      const networkType = await global.yubiaiPaymentArbitrableInstance.web3.eth.net.getNetworkType();
      loadCurrencyPrices(dispatch, global, networkType);
    }
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

    if (user && !global.currencyPriceList.length && global.profile && global.yubiaiPaymentArbitrableInstance) {
      loadCurrencies();
      return
    }

  }, [user, global.yubiaiPaymentArbitrableInstance, global.currencyPriceList, global.profile, loggedOut])

  const { data: categories, isLoading, isError } = useFetch('/categories/')

  const getSubCategories = (categoryId) => {
    // Get SubCategories
    if (categoryId) {
      getListSubCategory(categoryId).then((res) => {
        let subcategories = res.data
        if (subcategories.length > 0) {
          setSubCategories(subcategories)
        }
      })
    } else {
      setSubCategories([])
    }
  }

  // Input Price config
  const format = (val) => val
  const parse = (val) => val.replace(/^\$/, '')
  const [priceValue, setPriceValue] = useState('')

  // Form Submit Preview
  const onSubmit = async (data) => {
    const form = new FormData()

    if (data.file1) {
      form.append('files', data.file1)
    }

    if (data.file2) {
      form.append('files', data.file2)
    }

    if (data.file3) {
      form.append('files', data.file3)
    }

    form.append('title', data.title)
    form.append('description', data.description)
    form.append('price', priceValue)
    form.append('seller', global.profile._id)
    form.append('maxorders', 3)
    form.append('category', data.category)
    form.append('subcategory', data.subcategory)
    form.append('currencySymbolPrice', selectedCurrency)
    form.append('ubiburningamount', sliderValue)

    // Get Title category and subcategory
    const categorySelected = categories.find(
      (category) => category._id === data.category
    )

    const subcategorySelected = subCategories.find(
      (subcategory) => subcategory._id === data.subcategory
    )

    let newData = JSON.stringify(Object.fromEntries(form))
    newData = JSON.parse(newData)
    newData = {
      ...newData,
      files: [data.file1, data.file2, data.file3],
      category: categorySelected.title,
      subcategory: subcategorySelected.title,
    }
    // Data Save useState
    setDataSubmit(form)
    setResult(newData)
    // Open Modal
    onOpen()
  }

  // Confirm Submit
  const confirmSubmit = async () => {
    setLoadingSubmit(true)

    try {
      await publishService.newItem(
        dataSubmit,
        global.profile.token
      )

      /*       let slugItem = response.data.result.slug
              ? response.data.result.slug
              : null */

      setLoadingSubmit(false)
      onClose()
      setStateSubmit(1)

      setTimeout(() => {
        onOpen()
      }, 300)
    } catch (err) {
      console.log(err, "err")
      setLoadingSubmit(false)
      setStateSubmit(2)
    }
  }

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading || !user || !global.yubiaiPaymentArbitrableInstance) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - New Listing</title>
      </Head>
      <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
        <Breadcrumb spacing='8px' mt='1em' separator={<ChevronRightIcon color='gray.500' />}>
          <BreadcrumbItem>
            <Link href="/" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}><Text color="#00abd1" cursor={'pointer'} _hover={{
              textDecoration: "underline"
            }}>{t("Home")}</Text></Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
              <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>{t("Profile")}</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Text>{t("Listing")}</Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading mt="5px">{t("New Listing")}</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          {categories && categories.length > 0 && (
            <Box mt="1em">
              <FormControl isRequired>
                <FormLabel color="black"> {t("Category")}</FormLabel>
                <Select
                  bg="white"
                  color="black"
                  name="category"
                  id="category"
                  placeholder={t("Select Category")}
                  _placeholder={{ color: 'gray.400' }}
                  isRequired={true}
                  {...register('category', {
                    required: true,
                    onChange: (e) => {
                      getSubCategories(e.target.value)
                    },
                  })}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id} id="category">
                      {t(category.title)}
                    </option>
                  ))}
                </Select>
              </FormControl>

            </Box>
          )}

          {subCategories.length > 0 && (
            <Box mt="1em">
              <FormControl isRequired>
                <FormLabel color="black">{t("Sub Category")}</FormLabel>
                <Select
                  bg="white"
                  color="black"
                  name="subcategory"
                  id="subcategory"
                  placeholder={t("Select Sub Category")}
                  _placeholder={{ color: 'gray.400' }}
                  isRequired={true}
                  {...register('subcategory', { required: true })}
                >
                  {subCategories.map((subcategory) => (
                    <option
                      key={subcategory._id}
                      value={subcategory._id}
                      id="subcategory"
                    >
                      {subcategory[lang]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Divider />
            </Box>
          )}
          <FormControl isRequired mt="1em">
            <FormLabel color="black">{t("Title")}</FormLabel>

            <Input
              placeholder={t(`Title is required, minimum ${MIN_TITLE_LENGTH} characters and maximum ${MAX_TITLE_LENGTH} characters`)}
              _placeholder={{ color: 'gray.400' }}
              color="gray.700"
              bg="white"
              {...register('title', {
                required: true, minLength: MIN_TITLE_LENGTH, maxLength: MAX_TITLE_LENGTH, onChange: (e) => { setCountTitle(e.target.value.length) }
              })}
              isRequired
            />
            <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countTitle < MIN_TITLE_LENGTH || countTitle > MAX_TITLE_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countTitle}</Text> / {MAX_TITLE_LENGTH}</Flex>
            <Text color="red" m="5px">{errors.title?.type === 'pattern' && errors.title?.message}</Text>
            <Text color="red" m="5px">{errors.title?.type === 'required' && t("Title is required")}</Text>
            <Text color="red" m="5px">{errors.title?.type === 'minLength' && t("Minimum required characters are 15")}</Text>
            <Text color="red" m="5px">{errors.title?.type === 'maxLength' && t("Maximum required characters are 72")}</Text>
          </FormControl>

          <FormControl isRequired mt="1em">
            <FormLabel color="black">{t("Description")}</FormLabel>
            <Editor />
            {/*  <Textarea
              placeholder={t(`Description is required, minimum ${MIN_DESCRIPTION_LENGTH} characters and maximum ${MAX_DESCRIPTION_LENGTH} characters`)}
              _placeholder={{ color: 'gray.400' }}
              color="gray.700"
              bg="white"
              {...register('description', { required: true, minLength: MIN_DESCRIPTION_LENGTH, maxLength: MAX_DESCRIPTION_LENGTH, onChange: (e) => { setCountDescription(e.target.value.length) } })}
              isRequired
            />
            <Flex m="5px" fontStyle={"italic"}>{t("Characters")} <Text color={countDescription < MIN_DESCRIPTION_LENGTH || countDescription > MAX_DESCRIPTION_LENGTH ? "red" : "green"} mr="5px" ml="5px">{countDescription}</Text> / {MAX_DESCRIPTION_LENGTH}</Flex>
            <Text color="red" m="5px">{errors.description?.type === 'pattern' && errors.description?.message}</Text>
            <Text color="red" m="5px">{errors.description?.type === 'required' && t("Description is Required")}</Text>
            <Text color="red" m="5px">{errors.description?.type === 'minLength' && t("Minimum required characters are 100")}</Text>
            <Text color="red" m="5px">{errors.description?.type === 'maxLength' && t("Maximum required characters are 800")}</Text> */}
          </FormControl>

          {global.currencyPriceList && global.currencyPriceList.length > 0 && (
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{t("Price")}</FormLabel>
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

          {/* <Box pt={6} pb={2} color="gray.700"
          >
            <FormControl isRequired mt="1em">
              <FormLabel color="black">{t("UBI Burning Amount")}</FormLabel>
              <Text fontStyle={"italic"}>({t("Remember that the amount to be burned will be deducted from the final sale price")}).</Text>
              <Box textAlign={"center"}>
                <Slider
                  width={{ base: "80%", sm: "80%", md: "100%" }}
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
                    2%
                    <Text fontStyle={"italic"} fontSize={{ base: "0.8em", md: "1em" }} ml="5px">({t("Recommended")})</Text>
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

          <Heading mt="1em">{t("Images / Videos / Audios")}</Heading>

          <Text>
            {t("UploadInfo")}
          </Text>

          <Flex display={'flex'} flexDirection={{ base: 'column', sm: 'row' }} color="gray.700">
            <FileUpload
              name="file1"
              acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp"
              isRequired={true}
              placeholder="Your File 1"
              control={control}
              resetField={resetField}
              getValues={getValues}
            >
              {t("Main Image")}
            </FileUpload>
            <FileUpload
              name="file2"
              acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
              isRequired={false}
              placeholder="Your File 2"
              control={control}
              resetField={resetField}
              getValues={getValues}
            >
              {t("File")}
            </FileUpload>
            <FileUpload
              name="file3"
              acceptedFileTypes="image/png, image/jpeg, image/jpg, image/webp, video/mp4, audio/mpeg"
              isRequired={false}
              placeholder="Your File 3"
              control={control}
              resetField={resetField}
              getValues={getValues}
            >
              {t("File")}
            </FileUpload>
          </Flex>

          <Box float={'right'} m="2em">
            <Button bg="#00abd1" color="white" type="submit">
              {t("Preview & Submit for review")}
            </Button>
          </Box>
        </form>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={onClose}
          size="5xl"
          scrollBehavior={'inside'}
        >
          {stateSubmit === 0 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalHeader>{t("Review your listing")}</ModalHeader>
                {loadingSubmit === false && <ModalCloseButton />}
                <ModalBody>
                  <PreviewItem item={result} />
                </ModalBody>

                <ModalFooter>
                  {loadingSubmit === false && (
                    <>
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        mr={3}
                        onClick={onClose}
                      >
                        {t("Go Back")}
                      </Button>
                      <Button
                        bg="#00abd1"
                        color="white"
                        onClick={() => confirmSubmit()}
                      >
                        {t("Submit for review")}
                      </Button>
                    </>
                  )}
                  {loadingSubmit === true && (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  )}
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 1 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalBody>
                  <SuccessItem />
                </ModalBody>
                <ModalFooter>
                  <Link href={'/profile/listings'}>
                    <Button>{t("Close")}</Button>
                  </Link>
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 2 && (
            <>
              <ModalOverlay />
              <ModalContent color="gray.700">
                <ModalBody>{t("Failed to post")}</ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setStateSubmit(0)
                      onClose()
                    }}
                  >
                    {t("Close")}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </>
          )}
        </Modal>
      </Container>
    </>
  )
}

export default NewListing