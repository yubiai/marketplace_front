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
import NotiTwoCard from '../Cards/NotiTwoCard'

const NotificationTwo = () => {
  const global = useGlobal()
  const dispatch = useDispatchGlobal()
  const { onOpen } = useDisclosure()
  const initRef = useRef()
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

  if (!data) return <Spinner
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
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <Button colorScheme="transparent" className='step-notifications'
                  onClick={onOpen} isDisabled={data && data.length === 0}>
                  <BsFillBellFill color="white" />
                  {data && data.items && data.items.length > 0 && (
                    <Box position={'absolute'} top={'-2px'} right={'6px'}>
                      <Badge colorScheme="green" fontSize="10px">
                        {isOpen ? "New" : "Empety"}
                      </Badge>
                    </Box>
                  )}
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverHeader fontWeight={"semibold"}>Notifications</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      {data && data.items && data.items.length > 0 && data.items.map((item, i) => {
                        return (
                          <NotiTwoCard
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

export default NotificationTwo;
