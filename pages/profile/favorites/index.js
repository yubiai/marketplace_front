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
import Head from 'next/head'
import ItemCardLg from '../../../components/Cards/ItemCardLg'
import { useGlobal } from '../../../providers/globalProvider'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Error from '../../../components/Infos/Error'
import useFetch from '../../../hooks/data/useFetch'
import Paginations from '../../../components/Layouts/Paginations'
import { useRouter } from 'next/router'

const Favorites = () => {
  const global = useGlobal()
  const router = useRouter()

  const { data, isLoading, isError } = useFetch(
    `/profiles/favorites/${
      (global && global.profile && global.profile._id) || null
    }?page=${global.pageIndex}&size=8`,
    global && global.profile && global.profile.token
  )

  if (isLoading && !data) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
  }

  console.log(data, 'data')

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Favorites</title>
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
              <Text fontWeight={'bold'}>Your favorites</Text>
            )}
          </Flex>
          {data && data.items && data.items.length === 0 && (
              <>
                <Center>
                <Heading mt="5em">
                  You do not have any items added to favorites.
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
                return <ItemCardLg key={i} item={item} />
              })}
          </SimpleGrid>
          <Paginations data={data ? data : null} />
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Favorites
