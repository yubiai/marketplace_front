import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import Loading from '../../components/Spinners/Loading'
import Head from 'next/head'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import { useRouter } from 'next/router'
import useFetch from '../../hooks/data/useFetch'

const Search = () => {
  const router = useRouter()
  const { query } = router.query

  const { data: items, loading, error } = useFetch(`/items/search?q=${query}`)

  if (loading) return <Loading />
  if (error) throw error

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
        {items && items.length === 0 && <Heading mt="5em">Not result.</Heading>}
          {items &&
            items.length > 0 &&
            items.map((item, i) => {
              return <ItemCardLg key={i} item={item} />
            })}
        </SimpleGrid>
        <Box m="2em">
          <Center>
            <Button bg="#00abd1" color="white" onClick={() => router.push('/')}>
              Back
            </Button>
          </Center>
        </Box>
      </Container>
    </>
  )
}

export default Search