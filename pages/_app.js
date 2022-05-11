import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";

import "../styles/globals.css";
import Footer from "../components/Layouts/Footer";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";

import { Hide } from "@chakra-ui/react";
import Axios from "axios";
import MetaAlert from "../components/Alerts/metaAlert";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header />
      <Hide below='md'>
        <Navbar />
      </Hide>
      <MetaAlert />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
