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
  Select,
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
  Divider,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import PreviewItem from '../../components/Modals/PreviewItem'
import SuccessItem from '../../components/Modals/SuccessItem'
import { itemService } from '../../services/itemService'
import FileUpload from '../../components/Utils/FileUpload'

const NewPublish = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [stateSubmit, setStateSubmit] = useState(0)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [dataSubmit, setDataSubmit] = useState(null)

  const [result, setResult] = useState(null)

  // State useForm
  const { handleSubmit, register, control } = useForm()

  // Input Price config
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')
  const [priceValue, setPriceValue] = useState('10')

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
    form.append('seller', 'idseller')
    form.append('maxorders', 3)
    form.append('category', 'services')
    form.append('subcategory', ['tag', 'subtag'])

    let newData = JSON.stringify(Object.fromEntries(form))
    newData = JSON.parse(newData)
    newData = {
      ...newData,
      pictures: [data.img1, data.img2, data.img3],
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

  return (
    <>
      <ProfileMenu>
        <Container maxW={'full'} h={{ md: '110vh' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading>New Publish</Heading>
            <Text mt="2em">Category</Text>
            <Select placeholder="Services" isDisabled></Select>
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
              max={50}
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
