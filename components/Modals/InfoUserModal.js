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
} from '@chakra-ui/react'
import ListBadges from '../Utils/ListBadges';

const InfoUserModal = ({ user, t }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  return (
    <>
      <Text
        onClick={onOpen}
        color="#01abd0"
        bg="transparent"
        cursor={'pointer'}
      >
        {t("Sell by")} {user.name}
      </Text>
      <ListBadges badges={user.badges} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user.name}
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
                  src={url_fleek + user.photo}
                  fallbackSrc={"/static/images/userdefault.png"}
                />
              </Center>
              <Text mt="1em">{t("Wallet")}</Text>
              <Text fontSize={"14px"}>{user.eth_address}</Text>
              <ListBadges badges={user.badges} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button color="#1c548b" mr={3} onClick={onClose}>
              {t("Close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InfoUserModal
