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
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import NotiCard from '../Cards/NotiCard'
import useFetch from '../../hooks/data/useFetch'
import { useGlobal } from '../../providers/globalProvider'

const NotificationDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const global = useGlobal()

  const userId = global && global.profile && global.profile._id

  const { data, isLoading, isError } = useFetch(
    `/noti/${userId}?size=6&seen=false`,
    global && global.profile && global.profile.token
  )

  if (isLoading && !data) return <Spinner />

  if (isError) {
    return <Spinner />
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
