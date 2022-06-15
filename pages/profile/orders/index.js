import { Container, Flex, Text } from '@chakra-ui/react'
import Head from 'next/head'
import OrderCard from '../../../components/Cards/OrderCard'
import Error from '../../../components/Infos/Error'
import Paginations from '../../../components/Layouts/Paginations'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Loading from '../../../components/Spinners/Loading'
import useFetch from '../../../hooks/data/useFetch'
import { useGlobal } from '../../../providers/globalProvider'

const Orders = () => {
  const global = useGlobal()

  const { data, loading, error } = useFetch(
    `/orders/buyer/${
      global && global.profile && global.profile.eth_address
    }?page=${global.pageIndex}&size=4`
  )

  if (loading) return <Loading />

  if (error) {
    return <Error error={error?.message} />
  }

  console.log(data)

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
