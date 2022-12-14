import {
  Container,
  Flex,
  Grid,
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

  const { data, isLoading, isError } = useFetch(`/items/search?q=${query}`)

  if (isError) {
    return <Error error={isError?.message} />
  }

  if (isLoading) return <Loading />

  if (!data) return <Error error={"No result"} />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Search</title>
        <meta
          name="keywords"
          content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask"
        />
      </Head>
      <Container
        maxW="6xl"
        h={{
          base: data && data.length > 1 ? 'full' : '80vh',
          md: data && data.length > 4 ? 'full' : '100vh'
        }}
        display={'flex'}
        flexDirection={'column'}
      >
        <Flex alignItems={'center'} mt="1em">
          {data && data.length > 0 && (
            <Text fontWeight={'bold'}>Search results</Text>
          )}
        </Flex>
        <Grid
          templateRows={{ base: 'repeat(1, 1fr)', md: 'none' }}
          templateColumns={{ base: 'none', md: 'repeat(4, 1fr)' }}
          gap={1}
        >        
        {data && data.length === 0 && <Warm message="Not Result." />}
        {data && data.length > 0 && data.map((item, i) => { return <ItemCardLg key={i} item={item} /> })}
        </Grid>
      </Container>
    </>
  )
}

export default Search
