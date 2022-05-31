import { Box, Heading, Text, Button } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Error 404</title>
      </Head>
      <Box textAlign="center" h="100vh" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bg="#00abd1"
          color="white"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={'gray.500'} mb={6}>
          Page not exists.
        </Text>

        <Button bg="#00abd1" color="white" variant="solid">
          <Link href="/">Go to Home</Link>
        </Button>
      </Box>
    </>
  )
}
