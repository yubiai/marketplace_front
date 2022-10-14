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
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { notiService } from '../../services/notiService'
import NotiCard from '../Cards/NotiCard'

const NotificationDrawer = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const [data, setData] = useState([])

  useEffect(() => {
    const init = () => {
      setData(null)
      if (global.notificationsList.totalItems > 0) {
        setData(global.notificationsList)
      } else {
        setData([])
      }
    }
    init()
  }, [global.notificationsList])

  const callApiNoti = async () => {
    await notiService
      .getNotiFalseByUserId(global.profile._id, global.profile.token)
      .then((res) => {
        dispatch({
          type: 'SET_NOTIFICATIONS',
          payload: res.data,
        })
        return
      })
      .catch((err) => {
        console.log(err)
        return
      })
  }

  if (!data) return <Spinner />

  if (global && global.profile) {
    return (
      <>
        <Button ref={btnRef} colorScheme="transparent" className='step-notifications'
          onClick={onOpen} isDisabled={data && data.length === 0}>
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
          <DrawerContent bg="white" color="black"
          >
            <DrawerCloseButton />
            <DrawerHeader>Notifications</DrawerHeader>

            <DrawerBody>
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
                        callApiNoti={callApiNoti}
                      />
                    )
                  })}
              </SimpleGrid>
              {data && data.length === 0 && (
                <>
                  <Text>No notifications.</Text>
                </>
              )}
            </DrawerBody>

            <DrawerFooter justifyContent={'space-between'}>
              <Button
                backgroundColor={'#00abd1'}
                color={'white'}
                rounded={'full'}
                cursor={'pointer'}
                display={{ base: 'none', md: 'flex' }}
                onClick={() => {
                  router.push('/profile/notifications')
                  onClose()
                }}
              >
                See more
              </Button>
              <Button variant="outline" mr={3} onClick={onClose}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }
}

export default NotificationDrawer
