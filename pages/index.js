import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CarouselCards from '../components/Cards/CarouselCards'
import Loading from '../components/Spinners/Loading'
import { useGlobal } from '../providers/globalProvider'
import { profileService } from '../services/profileService'

const Home = ({ items }) => {
  const global = useGlobal()
  const [favorites, setFavorites] = useState(null)
  const [listFavorites, setListFavorites] = useState(null)
  const [listRandom, setListRandom] = useState(null)

  const arrayRandom = () => {
    if (items) {
      let newList = []
      items.map((item) => {
        newList.push(item)
      })

      const shuffleArray = () => {
        newList.sort(() => Math.random() - 0.5)
      }

      shuffleArray()
      setListRandom(newList)
    }
  }

  useEffect(() => {
    const initItem = async () => {
      setFavorites(null)
      if (global && global.profile && global.profile._id) {
        await profileService
          .getFavorites(global.profile._id)
          .then((res) => {
            const favorites = res.data
            if (favorites.length > 0) {
              setListFavorites(favorites)
              setFavorites(true)
            }
          })
          .catch((err) => {
            console.log(err)
            setListFavorites([])
            setFavorites(false)
            arrayRandom()
          })
      } else {
        setFavorites(false)
        arrayRandom()
      }
    }
    initItem()
  }, [global, global.profile])

  if (!items) return <Loading />

  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Home</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f8f8f8" />
        <meta name="description" content="Marketplace" />
        <meta name="keywords" content="yubiai, market, marketplace, crypto, eth, ubi, poh, metamask" />
        <meta name="author" content="VeneziaDev" />
        <meta property="og:title" content="Yubiai - Web" />
        <meta property="og:description" content="Marketplace" />
        <meta property="og:url" content="https://www.yubiai.com/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/logo2.png" />
        <meta name="Robots" content="all" />
      </Head>

      <main>
        <Box h={{base: "full", sm: "full", md: "full", lg: "100vh", xl: "100vh"}} m="2em">
          <CarouselCards
            title={'Popular services'}
            items={items}
          />
          {favorites === true && (
            <CarouselCards
              title={'Your favorites'}
              items={listFavorites}
            />
          )}
          {favorites === false && (
            <CarouselCards title={'Last viewed items'} items={listRandom} />
          )}
        </Box>
      </main>
    </>
  )
}

export async function getStaticProps() {
  try {
    const res = await axios.get('/items/?size=30&categoryId=628be6c99659a661e05f9e2f')
    const items = res.data.items;
    return { props: { items } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}

export default Home
