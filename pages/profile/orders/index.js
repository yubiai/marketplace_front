import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Center,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OrderCardBuyer from '../../../components/Cards/OrderCardBuyer'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import useUser from '../../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'
import { setYubiaiInstance } from '../../../providers/orderProvider'

const Orders = () => {
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

  useEffect(() => {
    if (!global.yubiaiPaymentArbitrableInstance) {
      setYubiaiInstance(dispatch);
    }
  }, [global.yubiaiPaymentArbitrableInstance]);

  const { data, isLoading, isError } = useFetch(
    global && global.profile && global.profile.eth_address ? `/orders/buyer/${global.profile.eth_address}?page=${global.pageIndex}&size=4` : null,
    global && global.profile && global.profile.token
  )

  if (isLoading || !data) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Orders </title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{ base: data && data.items && data.items.length > 1 ? 'full' : '70vh', sm: data && data.items && data.items.length > 1 ? 'full' : '85vh', md: 'full' }}
          display={'flex'}
          flexDirection={'column'}
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
            <Link href="/profile/" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>
              <Text color="#00abd1" cursor={'pointer'} _hover={{ textDecoration: "underline" }}>Profile</Text>
            </Link>
          </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>Orders</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          
          {data && data.items && data.items.length === 0 && (
            <>
              <Center>
                <Heading mt="5em">You do not have any orders.</Heading>
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
          {data &&
            data.items &&
            data.items.length > 0 &&
            data.items.map((item, i) => {
              return <OrderCardBuyer yubiaiPaymentInstance={global.yubiaiPaymentArbitrableInstance} order={item} key={i} />
            })}
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Orders
