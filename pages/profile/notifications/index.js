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
import { useEffect } from 'react'
import ButtonMarkAllAsRead from '../../../components/Buttons/ButtonMarkAllAsRead'
import NotiCard from '../../../components/Cards/NotiCard'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import useUser from '../../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'

const Notifications = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router, dispatch])

  const { data, isLoading, isError } = useFetch(
    global && global.profile && global.profile._id
      ? `/noti/${global.profile._id}?page=${global.pageIndex}&size=10`
      : null,
    global && global.profile && global.profile.token
  )

  if (isLoading || !user || !data) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

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
            base: data && data.items && data.items.length > 1 ? 'full' : '70vh',
            sm: data && data.items && data.items.length > 1 ? 'full' : '85vh',
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
              }}>Home</Text></Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>Notifications</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Center py={6}>

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

              {data && data.items && data.items.length === 0 && (
                <>
                  <Center>
                    <Heading mt="5em">You do not have any notifications.</Heading>
                  </Center>
                  <Center>
                    <Button
                      backgroundColor={'#00abd1'}
                      color={'white'}
                      rounded={'full'}
                      m="1em"
                      onClick={() => router.push('/')}
                    >
                      Back
                    </Button>
                  </Center>
                </>
              )}
              <Stack divider={<StackDivider />} spacing='4' width={"100%"}>
                <Flex display={"flex"}>
                  <Heading size="md" mt="10px">Notifications</Heading>
                  <Spacer />
                  <ButtonMarkAllAsRead />
                </Flex>
                {data &&
                  data.items &&
                  data.items.length > 0 &&
                  data.items.map((item, i) => {
                    return (
                      <div key={i}>
                        <NotiCard item={item} />
                      </div>
                    )
                  })}
              </Stack>
              <Paginations data={data ? data : null} />
            </Stack>
          </Center>
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Notifications
