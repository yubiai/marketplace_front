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
import { useEffect, useState } from 'react'
import ItemCardLg from '../../components/Cards/ItemCardLg'
import { useGlobal } from '../../providers/globalProvider'
import { useRouter } from 'next/router'

const Search = () => {
  const global = useGlobal()
  const router = useRouter()
  const { query } = router.query

  const [items, setItems] = useState(null)

  useEffect(() => {
    const initSearch = async () => {
      const searchEndpoint = (query) => `/api/search?q=${query}`
      if (query && query.length) {
        fetch(searchEndpoint(query))
          .then((res) => res.json())
          .then((res) => {
            console.log(res.results)
            setItems(res.results)
          })
      }
    }
    initSearch()
  }, [global, query])

  if (!items) return <Loading />

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
          {items.length === 0 && <Heading mt="5em">Not result.</Heading>}
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
