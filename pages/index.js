import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import CarouselCards from '../components/Cards/CarouselCards'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Yubiai Marketplace - Web</title>
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
          <CarouselCards title={'Last services posted on the marketplace'} />
          <CarouselCards title={'Services in your watchlist'} />
        </Box>
      </main>
    </div>
  )
}
