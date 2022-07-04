import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
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
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
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
import { loadCurrencyPrices } from '../../providers/orderProvider'

const NewListing = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const router = useRouter()

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedCurrency, setSelectedCurrency] = useState('ETH')

  // State SubCategories
  const [subCategories, setSubCategories] = useState([])

  // State useForm
  const { handleSubmit, register, control } = useForm()
  const [result, setResult] = useState(null)

  // State Submit
  const [stateSubmit, setStateSubmit] = useState(0)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [dataSubmit, setDataSubmit] = useState(null)
  const [itemSuccess, setItemSuccess] = useState(null)

  const [sliderValue, setSliderValue] = useState(2)

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  // Auth
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }

    if (user && !global.currencyPriceList.length) {
      loadCurrencyPrices(dispatch, global)
      return
    }
  }, [user, loggedOut, router, global.currencyPriceList])

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

    if (data.img1) {
      form.append('file', data.img1)
    }

    if (data.img2) {
      form.append('file', data.img2)
    }

    if (data.img3) {
      form.append('file', data.img3)
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
      pictures: [data.img1, data.img2, data.img3],
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
      let response = await publishService.newItem(
        dataSubmit,
        global.profile.token
      )
      console.log(response, 'result')

      let slugItem = response.data.result.slug
        ? response.data.result.slug
        : null

      setLoadingSubmit(false)
      onClose()
      setItemSuccess(slugItem)
      setStateSubmit(1)

      setTimeout(() => {
        onOpen()
      }, 300)
    } catch (err) {
      console.log(err)
      setLoadingSubmit(false)
      setStateSubmit(2)
    }
  }

  if (isLoading || !user) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - New Listing</title>
      </Head>
      <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
        <Heading mt="1em">New Listing</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          {categories && categories.length > 0 && (
            <Box mb="2em">
              <Text mt="2em">Category</Text>
              <Select
                bg="white"
                color="black"
                name="category"
                id="category"
                placeholder="Select Category"
                {...register('category', {
                  required: true,
                  onChange: (e) => {
                    getSubCategories(e.target.value)
                  },
                })}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id} id="category">
                    {category.title}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          {subCategories.length > 0 && (
            <Box mb="2em">
              <Text mt="2em">Sub Category</Text>
              <Select
                bg="white"
                color="black"
                name="subcategory"
                id="subcategory"
                placeholder="Select Sub Category"
                {...register('subcategory', { required: true })}
              >
                {subCategories.map((subcategory) => (
                  <option
                    key={subcategory._id}
                    value={subcategory._id}
                    id="subcategory"
                  >
                    {subcategory.title}
                  </option>
                ))}
              </Select>
              <Divider />
            </Box>
          )}
          <Text mt="2em">Title</Text>
          <Input
            placeholder="Title"
            bg="white"
            {...register('title', { required: true, maxLength: 72 })}
            isRequired
          />

          <Text mt="2em">Description</Text>
          <Textarea
            placeholder="Description"
            bg="white"
            {...register('description', { required: true, maxLength: 800 })}
            isRequired
          />
          <Text mt="2em">Price</Text>
          <Box margin="1rem 0">
            {global.currencyPriceList && global.currencyPriceList.length > 0 && (
              <Box mb="2em">
                <Select
                  bg="white"
                  color="black"
                  name="currency"
                  id="currency"
                  placeholder="Select Currency"
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
                  <option
                      key={"Ubi"}
                      value={""}
                      id="currency"
                      disabled
                    >
                      UBI (Coming Soon!)
                    </option>
                </Select>
              </Box>
            )}
            <NumberInput
              onChange={(valueString) => setPriceValue(parse(valueString))}
              value={format(priceValue)}
              bg="white"
              min={0.00001}
              max={999999}
              isRequired
            >
              <NumberInputField placeholder='Ex. 0.002'/> 
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>

          <Box pt={6} pb={2}>
            <Text>UBI Burning Amount</Text>
            <Text fontStyle={"italic"}>(Remember that the amount to be burned will be deducted from the final sale price).</Text>
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
                <Flex>2% <Text fontStyle={"italic"} ml="5px">(Recommended)</Text></Flex>
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

          <Heading mt="1em">Product Images</Heading>

          <Text>
            Get noticed by the right buyers with visual examples of your
            services. Images must have a minimum width of 375px, height of 375px
            and must not be more than 10mb each
          </Text>

          <Flex display={'flex'} flexDirection={{ base: 'column', sm: 'row' }}>
            <FileUpload
              name="img1"
              acceptedFileTypes="image/*"
              isRequired={true}
              placeholder="Your photo 1"
              control={control}
            >
              Image 1
            </FileUpload>
            <FileUpload
              name="img2"
              acceptedFileTypes="image/*"
              isRequired={false}
              placeholder="Your photo 2"
              control={control}
            >
              Image 2
            </FileUpload>
            <FileUpload
              name="img3"
              acceptedFileTypes="image/*"
              isRequired={false}
              placeholder="Your photo 3"
              control={control}
            >
              Image 3
            </FileUpload>
          </Flex>

          <Box float={'right'} m="2em">
            <Button bg="#00abd1" color="white" type="submit">
              Preview & Submit for review
            </Button>
          </Box>
        </form>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="5xl"
          scrollBehavior={'inside'}
        >
          {stateSubmit === 0 && (
            <>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Review your listing</ModalHeader>
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
                        Go Back
                      </Button>
                      <Button
                        bg="#00abd1"
                        color="white"
                        onClick={() => confirmSubmit()}
                      >
                        Submit for review
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
              <ModalContent>
                <ModalBody>
                  <SuccessItem />
                </ModalBody>
                <ModalFooter>
                  <Link href={itemSuccess ? `/item/${itemSuccess}` : '/'}>
                    <Button>Close</Button>
                  </Link>
                </ModalFooter>
              </ModalContent>
            </>
          )}
          {stateSubmit === 2 && (
            <>
              <ModalOverlay />
              <ModalContent>
                <ModalBody>Error de carga</ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setStateSubmit(0)
                      onClose()
                    }}
                  >
                    Close
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