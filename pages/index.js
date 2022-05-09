import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Layouts/Hero'

export default function Home() {
  return (
    <div>
      <Head>
        <title>YUBIAI</title>
        <meta name="description" content="YUBIAI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
      </main>
    </div>
  )
}
