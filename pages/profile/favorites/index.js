import { Container, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Loading from '../../../components/Spinners/Loading'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ItemCardLg from '../../../components/Cards/ItemCardLg'
import { profileService } from '../../../services/profileService'
import { useGlobal } from '../../../providers/globalProvider'
import { useRouter } from 'next/router'
import ProfileMenu from '../../../components/Menus/ProfileMenu'

const Favorites = () => {
  const global = useGlobal()
  const router = useRouter()
  const [items, setItems] = useState(null)

  const getFavorites = async () => {
    await profileService
      .getFavorites((global && global.profile && global.profile._id) || null)
      .then((res) => {
        const favorites = res.data || []
        setItems(favorites)
      })
      .catch((err) => {
        console.log(err)
        setItems([])
      })
  }

  useEffect(() => {
    const initItem = () => {
      if (global && global.profile) {
        getFavorites()
      } else {
        router.push('/')
      }
    }
    initItem()
  }, [global])

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
      <ProfileMenu>
        <Container
          maxW="6xl"
          h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
          display={'flex'}
          flexDirection={'column'}
        >
          <Flex alignItems={'center'} mt="1em">
            {items && items.length > 0 && (
              <Text fontWeight={'bold'}>Your favorites</Text>
            )}
          </Flex>
          <SimpleGrid minChildWidth="250px" spacing="2px">
            {items.length === 0 && (
              <Heading mt="5em">
                You do not have any items added to favorites.
              </Heading>
            )}
            {items &&
              items.length > 0 &&
              items.map((item, i) => {
                return <ItemCardLg key={i} item={item} />
              })}
          </SimpleGrid>
        </Container>
      </ProfileMenu>
    </>
  )
}

export default Favorites
