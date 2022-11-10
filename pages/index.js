import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CarrouselCards from '../components/Cards/CarrouselCards'
import Loading from '../components/Spinners/Loading'
import { useGlobal } from '../providers/globalProvider'
import { profileService } from '../services/profileService'

const Home = ({ items }) => {
  const global = useGlobal();
  const [favourites, setFavourites] = useState(null);
  const [listFavourites, setListFavourites] = useState(null);
  const [listRandom, setListRandom] = useState(null);

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
      setFavourites(null)
      if (global && global.profile && global.profile._id) {
        await profileService
          .getFavourites(global.profile._id, "40", global?.profile?.token)
          .then((res) => {
            const favourites = res.data.items;
            if (favourites.length > 0) {
              setListFavourites(favourites)
              setFavourites(true)
            }
            if (favourites.length === 0) {
              setListFavourites([])
              setFavourites(false)
              arrayRandom()
            }
          })
          .catch((err) => {
            console.log(err)
            setListFavourites([])
            setFavourites(false)
            arrayRandom()
          })
      } else {
        setFavourites(false)
        arrayRandom()
      }
    }
    initItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global.profile])


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
        <link rel="shortcut icon" type="image/png" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="Robots" content="all" />
      </Head>

      <main>
        <Box h={{ base: "full", sm: "full", md: "full", lg: "full", xl: "100vh" }} m="2em">
          <CarrouselCards
            title={'Popular services'}
            items={items}
          />
          {favourites === null && <Loading />}
          {favourites === true && (
            <CarrouselCards
              title={'Your favourites'}
              items={listFavourites}
            />
          )}
          {favourites === false && (
            <CarrouselCards title={'Last viewed items'} items={listRandom} />
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
    if (items.length === 0) {
      return { notFound: true };
    }
    return { props: { items }, revalidate: 1800 }
  } catch (err) {
    console.log(err)
    return { notFound: true };
  }
}

export default Home
