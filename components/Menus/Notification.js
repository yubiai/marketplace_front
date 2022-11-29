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
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import { useGlobal } from '../../providers/globalProvider'
import NotiCard from '../Cards/NotiCard'
import useFetch from '../../hooks/data/useFetch'
import ButtonMarkAllAsRead from '../Buttons/ButtonMarkAllAsRead'

const Notification = () => {
  const global = useGlobal();
  const initRef = useRef();

  const { data: notis, isLoading, isError, mutate } = useFetch(
    global && global.profile && global.profile._id
      ? `/noti/seen/false/${global.profile._id}?limit=4`
      : null,
    global && global.profile && global.profile.token
  );

  useEffect(() => {
    async function initial() {
      await mutate();
    }
    initial();
  }, [global.notificationsActive])

  if (isLoading || isError) return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="md"
    />
  );

  if (global && global.profile) {
    return (
      <>
        <Popover closeOnBlur={true} placement='bottom' initialFocusRef={initRef}>
          {({ onClose }) => {
            if (!notis) {
              onClose();
            }
            return (
              <>
                <PopoverTrigger>
                  <Button colorScheme="transparent" className='step-notifications'
                    isDisabled={notis && notis.length === 0}>
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
                      <ButtonMarkAllAsRead onClosePopover={onClose} mutate={mutate} />
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
                              mutate={mutate}
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
            )
          }}
        </Popover>
      </>
    )
  } else {
    return null;
  }
}

export default Notification;
