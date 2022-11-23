import {
  Badge,
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import { useDispatchGlobal, useGlobal } from '../../providers/globalProvider'
import { notiService } from '../../services/notiService'
import ButtonMarkAllAsRead from '../Buttons/ButtonMarkAllAsRead'
import NotiCard from '../Cards/NotiCard'

const Notification = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { onOpen } = useDisclosure()
  const initRef = useRef()
  const [notis, setNotis] = useState([])

  useEffect(() => {
    const init = () => {
      setNotis(null)
      if (global.notificationsList && global.notificationsList.length > 0) {
        setNotis(global.notificationsList)
      } else {
        setNotis([])
      }
    }
    init()
  }, [global.notificationsList])

  const callApiNoti = async () => {
    await notiService
      .getNotisSeenFalseById(global.profile._id, global.profile.token)
      .then((res) => {
        dispatch({
          type: 'SET_NOTIFICATIONS',
          payload: res.notis,
        })
        return
      })
      .catch((err) => {
        console.log(err)
        return
      })
  }

  if (!notis) return <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="md"
  />

  if (global && global.profile) {
    return (
      <>
        <Popover closeOnBlur={false} placement='bottom' initialFocusRef={initRef}>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <Button colorScheme="transparent" className='step-notifications'
                  onClick={onOpen} isDisabled={notis && notis.length === 0}>
                  <BsFillBellFill color="white" />
                  {notis && notis && notis.length > 0 && (
                    <Box position={'absolute'} top={'-2px'} right={'6px'}>
                      <Badge colorScheme="green" fontSize="10px">
                        New                  </Badge>
                    </Box>
                  )}
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverHeader fontWeight={"semibold"}>
                    Notifications
                    <ButtonMarkAllAsRead onClosePopover={onClose} />
                    <PopoverCloseButton />
                  </PopoverHeader>
                  <PopoverBody>

                    <Stack divider={<StackDivider />} spacing=''>
                      {notis && notis && notis.length > 0 && notis.map((item, i) => {
                        return (
                          <NotiCard
                            key={i}
                            item={item}
                            onClose={onClose}
                            callApiNoti={callApiNoti}
                          />
                        )
                      })}
                    </Stack>
                  </PopoverBody>
                  <PopoverFooter>
                    <Flex>
                      <Text mt="10px" color="#00abd1" as="u" onClick={() => onClose()} _hover={{
                        color: "blue.400"
                      }}>
                        <Link href="/profile/notifications">
                          View All
                        </Link>

                      </Text>

                    </Flex>
                  </PopoverFooter>
                </PopoverContent>
              </Portal>
            </>
          )}
        </Popover>
      </>
    )
  }
}

export default Notification;
