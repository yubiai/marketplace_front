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
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation';

const Notification = () => {
  const global = useGlobal();
  const initRef = useRef();
  const { t } = useTranslation("notifications");
  const router = useRouter();

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
    if (global && global.profile) {
      initial();
    }
  }, [global.notificationsActive, global.profile]);
  
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
            if (!notis || !notis.notifications) {
              onClose();
            }
            return (
              <>
                {notis && notis.notifications && notis.notifications.length > 0 && (
                  <PopoverTrigger>
                    <Button colorScheme="transparent" className='step-notifications'
                      _hover={{ bg: '#1C538A', color: 'gray.200' }}
                      _expanded={{ bg: 'blue.400' }}
                      _focus={{ boxShadow: 'outline' }}>
                      <BsFillBellFill color="white" />
                      <Box position={'absolute'} top={'-2px'} right={'11px'}>
                        <Badge colorScheme="green" fontSize="12px">
                          {notis.quantity > 99 ? "+99" : notis.quantity} </Badge>
                      </Box>
                    </Button>
                  </PopoverTrigger>
                )}
                {!notis || notis.notifications.length === 0 && (
                  <Button onClick={() => router.push("/profile/notifications")} colorScheme="transparent" className='step-notifications'
                    _hover={{ bg: '#1C538A', color: 'gray.200' }}
                    _focus={{ boxShadow: 'outline' }}>
                    <BsFillBellFill color="white" />
                  </Button>
                )}
                <Portal>
                  <PopoverContent>
                    <PopoverHeader fontWeight={"semibold"}>
                    {t("Notifications")}
                      <ButtonMarkAllAsRead onClosePopover={onClose} mutate={mutate} />
                      <PopoverCloseButton />
                    </PopoverHeader>
                    <PopoverBody>

                      <Stack divider={<StackDivider />} spacing=''>
                        {notis && notis.notifications && notis.notifications.length > 0 && notis.notifications.map((item, i) => {
                          return (
                            <NotiCard
                              key={i}
                              item={item}
                              onClose={onClose}
                              mutate={mutate}
                              t={t}
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
                            {t("View All")}
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
