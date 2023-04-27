import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import SEO from '../components/Utils/SEO'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <SEO
            title={"Home"}
            description={"Yubiai is the leading web3 marketplace empowering users to buy, sell and trade digital assets across a wide variety of asset classes in a secure and intuitive platform."}
            keywords={"Yubiai, Web3 Marketplace, Decentralized Exchange, Crypto Trading, Secure Transaction, Smart Contract Enabled Platform, Non-Custodial Wallets, High Security Protocols, Instant Liquidity, Low Fees"}
            imageUrl={"/apple-touch-icon.png"}
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-SZSZPLEC9X"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-SZSZPLEC9X');
        `}
          </Script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
