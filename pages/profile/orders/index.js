import { Container, Flex, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OrderCard from '../../../components/Cards/OrderCard'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import useUser from '../../../hooks/data/useUser'
import { useDispatchGlobal, useGlobal } from '../../../providers/globalProvider'

const Orders = () => {
  const global = useGlobal()
  const router = useRouter()
  const dispatch = useDispatchGlobal()

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    console.log(user, loggedOut)
    if (loggedOut) {
      router.replace('/')
      dispatch({
        type: 'AUTHPROFILE',
        payload: null,
      })
    }
  }, [user, loggedOut, router, dispatch])

  const {
    data,
    isLoading,
    isError,
  } = useFetch(
    `/orders/buyer/${
      global && global.profile && global.profile.eth_address
    }?page=${global.pageIndex}&size=4`,
    global && global.profile && global.profile.token
  )


  if (isLoading || !user) return <Loading />

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
          h={{ base: 'full', sm: 'full', md: 'full' }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Flex alignItems={'center'} mt="1em">
            <Text fontWeight={'bold'}>Orders</Text>
          </Flex>
          {data &&
            data.items.length > 0 &&
            data.items.map((order, i) => {
              return <OrderCard order={order} key={i} />
            })}
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Orders
