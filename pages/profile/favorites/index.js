import { Container, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Loading from '../../../components/Spinners/Loading'
import Head from 'next/head'
import ItemCardLg from '../../../components/Cards/ItemCardLg'
import { useGlobal } from '../../../providers/globalProvider'
import ProfileMenu from '../../../components/Menus/ProfileMenu'
import Error from '../../../components/Infos/Error'
import useFetch from '../../../hooks/data/useFetch'
import Paginations from '../../../components/Layouts/Paginations'

const Favorites = () => {
  const global = useGlobal()

  const {
    data,
    loading,
    error,
  } = useFetch(`/profiles/favorites/${global && global.profile && global.profile._id || null}?page=${global.pageIndex}&size=8`);

  if (loading) return <Loading />

  if (error) {
    return <Error error={error?.message} />
  }

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
          h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Flex alignItems={'center'} mt="1em">
            {data && data.items && data.items.length > 0 && (
              <Text fontWeight={'bold'}>Your favorites</Text>
            )}
          </Flex>
          <SimpleGrid minChildWidth="250px" spacing="2px">
            {data && data.items && data.items.length === 0 && (
              <Heading mt="5em">
                You do not have any items added to favorites.
              </Heading>
            )}
            {data && data.items &&
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
