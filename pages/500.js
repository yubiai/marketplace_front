import { Box, Button, Heading, Text } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Error 500</title>
      </Head>
      <Box textAlign="center" py={10} px={5}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bg="#00abd1"
          color="white"
          backgroundClip="text"
        >
          500
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Error
        </Text>
        <Text color={'gray.500'} mb={6}>
          500 - Server-side error occurred
        </Text>

        <Button bg="#00abd1" color="white" variant="solid">
          <Link href="/">Go to Home</Link>
        </Button>
      </Box>
    </>
  )
}
