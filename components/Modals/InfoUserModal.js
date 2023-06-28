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
              {/* <Center mt="1em">
                {user && user.eth_address && user.poh_info && user.poh_info.first_name && (
                  <ButtonProtocolProfile profile={user} protocol={"poh"} />
                )}
                {user && user.lens_info && user.lens_info.handle && (
                  <ButtonProtocolProfile profile={user} protocol={"lens"} />
                )}
              </Center> */}
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
