import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
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
