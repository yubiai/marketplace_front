import { Box, Container, Heading, Text } from '@chakra-ui/react'
import Head from 'next/head'

const Help = () => {
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Help</title>
      </Head>
      <Container
        maxW="6xl"
        h={{ base: 'full', sm: 'full', md: 'full', lg: '100vh', xl: '100vh' }}
        display={'flex'}
        flexDirection={'column'}
      >
        <Box h="100vh">
          <Heading mt="1em">Help</Heading>
          <Text>
            Welcome to Yubiai, the marketplace where you can find or publish
            services with crypto. For any support that you need you can contact
            us through our social media channels.
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default Help
