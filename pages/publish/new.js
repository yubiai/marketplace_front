import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Divider,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import PreviewItem from '../../components/Modals/PreviewItem'
import SuccessItem from '../../components/Modals/SuccessItem'
import { itemService } from '../../services/itemService'
import FileUpload from '../../components/Utils/FileUpload'
import { subcategoryService } from '../../services/subcategoryService'
import { useGlobal } from '../../providers/globalProvider'
import { useRouter } from 'next/router'

const NewPublish = () => {
  // Global
  const global = useGlobal()
  const router = useRouter()

  //Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // State useForm
  const { handleSubmit, register, control } = useForm()
  const [result, setResult] = useState(null)

  // State Submit
  const [stateSubmit, setStateSubmit] = useState(0)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [dataSubmit, setDataSubmit] = useState(null)

  // Input Price config
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')
  const [priceValue, setPriceValue] = useState('0')

  // Sub Categories
  const [subCategories, setSubCategories] = useState([])

  // Loading Sub Categories
  useEffect(() => {
    return async () => {
      if (global && global.profile) {
        console.log(global.profile)
        await subcategoryService
          .getSubCategories()
          .then((res) => {
            const result = res.data.result
            if (result.length > 0) {
              console.log(result)
              setSubCategories(result)
            }
          })
          .catch((err) => {
            console.log(err)
            setSubCategories(null)
          })
      } else {
        router.push('/')
      }
    }
  }, [global, router])

  // Form Submit Preview
  const onSubmit = async (data) => {
    console.log(data, 'dataaa')
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
    form.append('category', 'services')
    form.append('subcategory', data.subcategory)

    let newData = JSON.stringify(Object.fromEntries(form))
    newData = JSON.parse(newData)
    newData = {
      ...newData,
      pictures: [data.img1, data.img2, data.img3],
    }
    // Data Save useState
    console.log(newData)
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

  return (
    <>
      <ProfileMenu>
        <Container maxW={'full'} display={'flex'} flexDirection={'column'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading>New Publish</Heading>
            <Text mt="2em">Category</Text>
            <Select placeholder="Services" isDisabled></Select>

            {subCategories.length > 0 && (
              <Box mb="2em">
                <Text mt="2em">Sub Category</Text>
                <Select
                  bg="white"
                  color="black"
                  name="subcategory"
                  id="subcategory"
                  placeholder="Select Option"
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
              {...register('title', {})}
              isRequired
            />

            <Text mt="2em">Description</Text>
            <Textarea
              placeholder="Description"
              bg="white"
              {...register('description', { required: true, maxLength: 400 })}
              isRequired
            />
            <Text mt="2em">Price</Text>

            <NumberInput
              onChange={(valueString) => setPriceValue(parse(valueString))}
              value={format(priceValue)}
              bg="white"
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

            <Heading>Product Images</Heading>

            <Text>
              Get noticed by the right buyers with visual examples of your
              services. Images must have a minimum width of 375px, height of
              375px and must not be more than 10mb each
            </Text>

            <Flex>
              <FileUpload
                name="img1"
                acceptedFileTypes="image/*"
                isRequired={true}
                placeholder="Your avatar"
                control={control}
              >
                Imagen 1
              </FileUpload>
              <FileUpload
                name="img2"
                acceptedFileTypes="image/*"
                isRequired={false}
                placeholder="Your avatar"
                control={control}
              >
                Imagen 2
              </FileUpload>
              <FileUpload
                name="img3"
                acceptedFileTypes="image/*"
                isRequired={false}
                placeholder="Your avatar"
                control={control}
              >
                Imagen 3
              </FileUpload>
            </Flex>

            <Box float={'right'} mt="2em">
              <Button bg="#00abd1" color="white" type="submit">
                Preview & Submit for review
              </Button>
            </Box>
          </form>
        </Container>
      </ProfileMenu>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        {stateSubmit === 0 && (
          <>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Review your listing</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <PreviewItem item={result} />
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  mr={3}
                  onClick={onClose}
                >
                  Go Back
                </Button>

                {loadingSubmit === false && (
                  <Button
                    bg="#00abd1"
                    color="white"
                    onClick={() => confirmSubmit()}
                  >
                    Submit for review
                  </Button>
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
    </>
  )
}

export default NewPublish
