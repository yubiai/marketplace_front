import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";

import "../styles/globals.css";
import Footer from "../components/Layouts/Footer";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";

import { Hide } from "@chakra-ui/react";
import Axios from "axios";
import MetaAlert from "../components/Alerts/metaAlert";
import { GlobalProvider } from "../providers/globalProvider";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
Axios.defaults.headers['content-type']='application/json'
Axios.defaults.headers['withCredentials']=true
Axios.defaults.headers['crossorigin']=true

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <GlobalProvider>
      <Header />
      <Hide below='md'>
        <Navbar />
      </Hide>
      <MetaAlert />
      <Component {...pageProps} />
      <Footer />
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default MyApp;
