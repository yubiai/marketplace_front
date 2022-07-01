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
import { useEffect, useRef, useState } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import NotiCard from '../Cards/NotiCard'
import { useGlobal } from '../../providers/globalProvider'
import { notiService } from '../../services/notiService'

const NotificationDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const global = useGlobal()

  const [data, setData] = useState(null)

  const userId = (global && global.profile && global.profile._id) || null
  const token = (global && global.profile && global.profile.token) || null

  const refreshNoti = async () => {
    console.log('se activo')
    setData(null)
    await notiService
      .getNotiFalseByUserId(userId, token)
      .then((res) => {
        console.log(res, 'res')
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    const initial = () => {
      if (userId && token) {
        console.log('-------Se activo el use effect notification')
        refreshNoti()
      }
    }
    initial()
  }, [global.profile])

  if (!data) return <Spinner />

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
                      refreshNoti={refreshNoti}
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
