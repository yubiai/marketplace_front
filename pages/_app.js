import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from "../styles/theme";

import '../styles/globals.css'
import Footer from '../components/Layouts/Footer';
import Header from '../components/Layouts/Header';
import Navbar from '../components/Layouts/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  )
}

export default MyApp


