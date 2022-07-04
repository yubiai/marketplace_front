import {
    Button,
    Center,
    Container,
    Flex,
    Heading,
    Text,
  } from '@chakra-ui/react'
  import Head from 'next/head'
  import { useRouter } from 'next/router'
  import { useEffect } from 'react'
  import OrderCardSeller from '../../../../components/Cards/OrderCardSeller'
  import Error from '../../../../components/Infos/Error'
  import Paginations from '../../../../components/Layouts/Paginations'
  import ProfileMenu from '../../../../components/Menus/ProfileMenu'
  import Loading from '../../../../components/Spinners/Loading'
  import useFetch from '../../../../hooks/data/useFetch'
  import useUser from '../../../../hooks/data/useUser'
  import {
    useDispatchGlobal,
    useGlobal,
  } from '../../../../providers/globalProvider'
  
  const Sales = () => {
    const global = useGlobal()
    const router = useRouter()
    const dispatch = useDispatchGlobal()
  
    const { user, loggedOut } = useUser()
  
    // if logged in, redirect to the home
    useEffect(() => {
      console.log(user, loggedOut)
      if (loggedOut) {
        router.replace('/logout')
      }
    }, [user, loggedOut, router, dispatch])
  
    const { data, isLoading, isError } = useFetch(
      `/orders/seller/${
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
          <title>Yubiai Marketplace - Sales </title>
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
            {data && data.items && data.items.length > 0 && (
              <Flex alignItems={'center'} mt="1em">
                <Text fontWeight={'bold'}>Sales</Text>
              </Flex>
            )}
            {data && data.items && data.items.length === 0 && (
              <>
                <Center>
                  <Heading mt="5em">You do not have any sales.</Heading>
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
                return <OrderCardSeller order={item} key={i} />
              })}
            <Paginations data={data ? data : null} />
          </Container>
        </ProfileMenu>
      </>
    )
  }
  
  export default Sales
  