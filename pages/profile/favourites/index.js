import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import Loading from '../../../components/Spinners/Loading'
import Error from '../../../components/Infos/Error'
import Head from 'next/head'
import { useGlobal } from '../../../providers/globalProvider'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import useFetch from '../../../hooks/data/useFetch'
import Paginations from '../../../components/Layouts/Paginations'
import { useRouter } from 'next/router'
import useUser from '../../../hooks/data/useUser'
import { useEffect } from 'react'
import ItemCardPublish from '../../../components/Cards/ItemCardPublish'

const Favourites = () => {
  const global = useGlobal()
  const router = useRouter()

  const { user, loggedOut } = useUser()

  // if logged in, redirect to the home
  useEffect(() => {
    if (loggedOut) {
      router.replace('/logout')
    }
  }, [user, loggedOut, router])

  const { data, isLoading, isError } = useFetch(
    global && global.profile && global.profile._id ? `/profiles/favourites/${global.profile._id}?page=${global.pageIndex}&size=8` : null,
    global && global.profile && global.profile.token
  )

  if (isLoading && !data || !user) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Favourites</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{ base: data?.items?.length < 2 ? '80vh' : 'full', md: data?.items.length === 0 ? '80vh' : 'full' }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Flex alignItems={'center'} mt="1em">
            {data && data.items && data.items.length > 0 && (
              <Text fontWeight={'bold'}>Your favourites</Text>
            )}
          </Flex>
          {data && data.items && data.items.length === 0 && (
              <>
                <Center>
                <Heading mt="5em">
                  You do not have any items added to favourites.
                </Heading>
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
          <SimpleGrid minChildWidth="250px" spacing="2px">
            {data &&
              data.items &&
              data.items.length > 0 &&
              data.items.map((item, i) => {
                return <ItemCardPublish key={i} item={item} />
              })}
          </SimpleGrid>
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Favourites
