import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ButtonMarkAllAsRead from '../../../components/Buttons/ButtonMarkAllAsRead'
import NotiCard from '../../../components/Cards/NotiCard'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import useUser from '../../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'
import useTranslation from 'next-translate/useTranslation';


const Notifications = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()
  const { t } = useTranslation("notifications");
  const [notisSeenFalse, setNotisSeenFalse] = useState(false);
  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

  // Fetch Notis All
  const { data: notis, isLoading, isError, mutate } = useFetch(
    global && global.profile && global.profile._id
      ? `/noti/${global.profile._id}?page=${global.pageIndex}&size=10`
      : null,
    global && global.profile && global.profile.token
  )

  // Verify Notis Seen False
  useEffect(() => {
    async function initial() {
      const verify = notis && notis.items && notis.items.length > 0 && notis.items.find((noti) => noti.seen === false ? true : false)
      if (verify) {
        setNotisSeenFalse(true);
      } else {
        setNotisSeenFalse(false);
      }
    }
    initial();
  }, [notis, mutate]);

  // Active mutate with action global
  useEffect(() => {
    async function initialMutate() {
      await mutate();
    }
    initialMutate();
  }, [global.notificationsActive])

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading || !user || !notis) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Notifications </title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{
            base: notis && notis.items && notis.items.length > 6 ? 'full' : '70vh',
            sm: notis && notis.items && notis.items.length > 6 ? 'full' : '85vh',
            md: 'full',
          }}
          display={'flex'}
          flexDirection={'column'}
          color="black"
        >
          <Breadcrumb spacing='8px' mt='1em' mb='1em' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href="/" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}><Text color="#00abd1" cursor={'pointer'} _hover={{
                textDecoration: "underline"
              }}>{t("Home")}</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
                <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>{t("Profile")}</Text>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>{t("Notifications")}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          {notis && notis.items && notis.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">{t("You do not have any notifications.")}</Heading>
              </Center>
              <Center>
                <Button color={"black"} _hover={{ bg: "gray.200" }} m="2em" onClick={() => router.back()}>
                  {t("Go Back")}
                </Button>
              </Center>
            </>
          )}
          {notis && notis.items && notis.items.length > 0 && (
            <>
              <Center py={1}>
                <Stack
                  borderWidth="1px"
                  borderRadius="lg"
                  width={'full'}
                  height={'full'}
                  direction={{ base: 'column', md: 'row' }}
                  bg={'white'}
                  boxShadow={'2xl'}
                  padding={4}
                >
                  <Stack divider={<StackDivider />} spacing='4' width={"100%"}>
                    <Flex display={"flex"}>
                      <Heading size="md">{t("Notifications")}</Heading>
                      <Spacer />
                      {notisSeenFalse && <ButtonMarkAllAsRead onClosePopover={null} mutate={mutate} />}
                    </Flex>
                    {notis &&
                      notis.items &&
                      notis.items.length > 0 &&
                      notis.items.map((item, i) => {
                        return (
                          <div key={i}>
                            <NotiCard item={item} onClose={null} mutate={mutate} t={t} />
                          </div>
                        )
                      })}
                  </Stack>
                </Stack>

              </Center>
              <Paginations data={notis ? notis : null} />
            </>
          )}

        </Container>
      </ProfileMenu>
    </>
  )
}

export default Notifications
