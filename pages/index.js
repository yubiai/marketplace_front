import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import CarouselCards from '../components/Cards/CarouselCards'
import Loading from '../components/Spinners/Loading'

const Home = ({ itemsByServices }) => {

  if(!itemsByServices) return <Loading />

  return (
    <div>
      <Head>
        <title>Yubiai Marketplace - Home</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f8f8f8" />
        <meta name="description" content="Soy Marketplace" />
        <meta name="keywords" content="ybiaiiii" />
        <meta name="author" content="VeneziaDev" />
        <meta property="og:title" content="Yubiai - Web" />
        <meta property="og:description" content="Soy yubiii." />
        <meta property="og:url" content="https://www.yubiai.com/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/logo2.png" />
        <meta name="Robots" content="all" />
      </Head>

      <main>
        <Box h="80vh" m="2em">
          <CarouselCards
            title={'Items the services.'}
            items={itemsByServices}
          />
          <CarouselCards
            title={'Items in your favorites.'}
            items={itemsByServices}
          />
        </Box>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  try {
    const res = await axios.get(`/items/bycategory/628be6c99659a661e05f9e2f`)
    const itemsByServices = res.data.result
    return { props: { itemsByServices } }
  } catch (err) {
    console.log(err)
    return { props: '' }
  }
}

export default Home
