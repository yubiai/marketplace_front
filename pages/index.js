import { Box, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CarrouselCards from '../components/Cards/CarrouselCards'
import Loading from '../components/Spinners/Loading'
import { useGlobal } from '../providers/globalProvider'
import { profileService } from '../services/profileService'
import useTranslation from 'next-translate/useTranslation';
import SEO from '../components/Utils/SEO'

const Home = ({ items }) => {
  const global = useGlobal();
  const [listFavourites, setListFavourites] = useState(null);
  const [listRandom, setListRandom] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("home");

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
      setTimeout(() => {
        setListRandom(newList)
        setLoading(false)
      }, 3000);
    }
  }

  const initFavourites = async () => {
    setLoading(true)
    setListFavourites(null)
    if (global && global.profile && global.profile._id) {
      try {
        const result = await profileService.getFavourites(global.profile._id, "30", global?.profile?.token);
        const favourites = result.data.items;

        if (favourites.length > 0) {
          setListFavourites(favourites)
          setLoading(false)
          return
        }

        setListFavourites(null)
        arrayRandom()
        setLoading(false)
        return
      } catch (err) {
        console.error(err);
        setLoading(false)
        setListFavourites(null);
        arrayRandom();
      }
    } else {
      setListFavourites(null);
      arrayRandom();
    }
  }

  useEffect(() => {
    initFavourites()
  }, [global.profile])

  if (!items) return <Loading />

  return (
    <>
      <SEO
        title={"Home"}
        description={"Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform."}
        keywords="Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"
        imageUrl={"/static/apple-touch-icon.png"}
      />
      <main>
        <Box h={{ base: "full", sm: "full", md: "full", lg: "full", xl: "100vh" }} m="2em">
          <CarrouselCards
            title= {t('Popular Services')}
            items={items}
          />
          {loading && (
            <Box h="60vh">
              <Spinner
                thickness="4px"
                speed="0.65s"
                m="2em"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
              />
            </Box>
          )}
          {listFavourites && listFavourites.length > 0 && (
            <CarrouselCards
              title={t('Your favourites')}
              items={listFavourites}
            />
          )}
          {!listFavourites && listRandom && listRandom.length > 0 && (
            <CarrouselCards title={t('Last viewed items')} items={listRandom} />
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
    console.error(err)
    return { notFound: true };
  }
}

export default Home
