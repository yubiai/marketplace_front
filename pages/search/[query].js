import {
  Container,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import Loading from '../../components/Spinners/Loading'
import Head from 'next/head'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import { useRouter } from 'next/router'
import useFetch from '../../hooks/data/useFetch'
import Error from '../../components/Infos/Error'
import Warm from '../../components/Infos/Warm'

const Search = () => {
  const router = useRouter()
  const { query } = router.query

  const { data: items, isLoading, isError } = useFetch(`/items/search?q=${query}`)

  if (isLoading) return <Loading />

  if (isError) {
    return <Error error={isError?.message} />
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
      <Container
        maxW="6xl"
        h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
        display={'flex'}
        flexDirection={'column'}
      >
        <Flex alignItems={'center'} mt="1em">
          {items && items.length > 0 && (
            <Text fontWeight={'bold'}>Search results</Text>
          )}
        </Flex>
        <SimpleGrid minChildWidth="250px" spacing="2px">
        {items && items.length === 0 && <Warm message="Not Result." />}
          {items &&
            items.length > 0 &&
            items.map((item, i) => {
              return <ItemCardLg key={i} item={item} />
            })}
        </SimpleGrid>
      </Container>
    </>
  )
}

export default Search
