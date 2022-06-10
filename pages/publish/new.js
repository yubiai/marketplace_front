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
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Error from '../../components/Infos/Error'
import PreviewItem from '../../components/Modals/PreviewItem'
import SuccessItem from '../../components/Modals/SuccessItem'
import Loading from '../../components/Spinners/Loading'
import FileUpload from '../../components/Utils/FileUpload'
import useFetch from '../../hooks/data/useFetch'
import { useGlobal } from '../../providers/globalProvider'
import { itemService } from '../../services/itemService'
import { getListSubCategory } from '../../utils/itemUtils'

const NewPublish = () => {
  const global = useGlobal()

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // State SubCategories
  const [subCategories, setSubCategories] = useState([])

  // State useForm
  const { handleSubmit, register, control } = useForm()
  const [result, setResult] = useState(null)

  // State Submit
  const [stateSubmit, setStateSubmit] = useState(0)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [dataSubmit, setDataSubmit] = useState(null)

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
  const format = (val) =>   val + ` DAI` 
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
      let result = await itemService.newItem(dataSubmit)
      console.log(result, 'result')

      setLoadingSubmit(false)
      onClose()
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

  if (isLoading) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - New Publish</title>
      </Head>
      <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
        <Heading mt="1em">New Publish</Heading>
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
            {...register('title', { required: true, maxLength: 150 })}
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

          <NumberInput
            onChange={(valueString) => setPriceValue(parse(valueString))}
            value={format(priceValue)}
            bg="white"
            min={0.00001}
            max={999999}
            isRequired
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Divider />

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
                  <Link href="/">
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

export default NewPublish
