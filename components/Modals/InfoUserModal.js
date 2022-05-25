import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Image,
  Center,
  Box,
  Text,
  Link,
} from '@chakra-ui/react'

const InfoUserModal = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Text
        onClick={onOpen}
        color="#01abd0"
        bg="transparent"
        cursor={'pointer'}
      >
        Sell by {user.first_name} {user.last_name}
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user.first_name} {user.last_name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Center>
                <Image
                  alt={'Logo'}
                  borderRadius="2xl"
                  marginTop={'6px'}
                  width={'150px'}
                  objectFit={'cover'}
                  src={user.photo}
                  fallbackSrc={user.photo}
                />
              </Center>
              <Text mt="1em">Wallet: {user.eth_address}</Text>
              <Center mt="1em">
                <Link
                  href={
                    'https://app.proofofhumanity.id/profile/' + user.eth_address
                  }
                  isExternal
                >
                  <Button bg="#00ABD1" color="white">
                    My PoH Profile
                  </Button>
                </Link>
              </Center>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button color="#1c548b" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InfoUserModal
