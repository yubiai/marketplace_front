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
} from '@chakra-ui/react'
import { useState } from 'react'
import ProfileMenu from '../../components/Menus/ProfileMenu'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

const NewPublish = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stateSubmit, setStateSubmit] = useState(0)

  // State useForm
  const { register, handleSubmit } = useForm()

  // Input Price config
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')
  const [priceValue, setPriceValue] = useState('10')

  // Form Submit Preview
  const onSubmit = (data) => {
    const newItemPreview = {
      title: data.title,
      description: data.description,
      number: priceValue,
      category: 'services',
    }

    onOpen()
    console.log(newItemPreview)
  }

  // Confirm Submit
  const confirmSubmit = () => {
    console.log('Saved')
    onClose()
    setStateSubmit(1)

    setTimeout(() => {
      onOpen()
    }, 300)
  }

  return (
    <>
      <ProfileMenu>
        <Container maxW={'lg'}>
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
              <ModalBody>adsasdasdasdasd</ModalBody>

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
              <ModalBody>Todo genial</ModalBody>
              <ModalFooter>
                <Link href="/">
                  <Button>Go Home</Button>
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
