import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import NotiCard from '../Cards/NotiCard'

const NotificationDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  console.log("Se activo Drawer noti")

  const data = {
    items: [
      {
        _id: "asdasd",
        type: "Sale",
        path: "/",
        reference: "help",
        message: "New Sale!",
        updatedAt: new Date()
      }
    ]
  }

  return (
    <>
      <Button ref={btnRef} colorScheme="transparent" onClick={onOpen}>
        <BsFillBellFill color="white" />
        {data && data.items && data.items.length > 0 && (
          <Box position={'absolute'} top={'-2px'} right={'6px'}>
            <Badge colorScheme="green" fontSize="10px">
              New
            </Badge>
          </Box>
        )}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody>
            {data && data.items && data.items.length === 0 && (
              <Text>0 Notifications</Text>
            )}
            <SimpleGrid columns={1} spacing={5}>
              {data &&
                data.items &&
                data.items.length > 0 &&
                data.items.map((item, i) => {
                  return (
                    <NotiCard
                      key={i}
                      item={item}
                      onClose={onClose}
                    />
                  )
                })}
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NotificationDrawer
