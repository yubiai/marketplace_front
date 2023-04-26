import Head from 'next/head'

const SEO = ({ title, description, keywords, imageUrl }) => {
  return (
    <Head>
      <title>{`Yubiai a web3 marketplace - ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#f8f8f8" />
        <meta name="author" content="Yubiai Members" />
        <meta property="og:title" content={`Yubiai a web3 marketplace - ${title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content="https://www.yubiai.com/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="Robots" content="all" />
    </Head>
  )
}

export default SEO
