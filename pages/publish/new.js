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
} from '@chakra-ui/react'
import { useState } from 'react'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import PreviewItem from '../../components/Modals/previewItem'
import SuccessItem from '../../components/Modals/successItem'
import { itemService } from '../../services/itemService'
import FileUpload from '../../components/Utils/FileUpload'

const NewPublish = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stateSubmit, setStateSubmit] = useState(0)
  const [dataSubmit, setDataSubmit] = useState(null)

  // State useForm
  const {
    handleSubmit,
    register,
    control
  } = useForm()

  // Input Price config
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')
  const [priceValue, setPriceValue] = useState('10')

  // Form Submit Preview
  const onSubmit = (data) => {
    console.log(data, "dataaa form")
    const newItemPreview = {
      title: data.title,
      description: data.description,
      price: priceValue,
      pictures: ['asdadasdas', 'adasdaa12'],
      seller: 'idseller',
      maxorders: 3,
      category: 'services',
      subcategory: ['azz', 'asdsdsdaa12'],
    }

    setDataSubmit(newItemPreview)
    onOpen()
    console.log(newItemPreview)
  }

  // Confirm Submit
  const confirmSubmit = async () => {
    console.log('Saved')
    let result = await itemService.newItem(dataSubmit)
    if (!result) {
      console.log(result)
    }
    onClose()
    setStateSubmit(1)

    setTimeout(() => {
      onOpen()
    }, 300)
  }

  return (
    <>
      <ProfileMenu>
        <Container maxW={'lg'} h={{ md: "100vh"}}>
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
              isRequired={true}
              placeholder="Your avatar"
              control={control}
            >
              Imagen 2
            </FileUpload>

            <FileUpload
              name="img3"
              acceptedFileTypes="image/*"
              isRequired={true}
              placeholder="Your avatar"
              control={control}
            >
              Imagen 3
            </FileUpload>


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
                <PreviewItem />
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
                <Button
                  bg="#00abd1"
                  color="white"
                  onClick={() => confirmSubmit()}
                >
                  Submit for review
                </Button>
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
              <ModalCloseButton />
              <ModalBody>Error de carga</ModalBody>
            </ModalContent>
          </>
        )}
      </Modal>
    </>
  )
}

export default NewPublish
