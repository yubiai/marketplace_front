import { Box, Container, Heading, Text } from '@chakra-ui/react'
import Head from 'next/head'

const Favorites = () => {
  return (
    <>
      <Head>
        <title>Yubiai Marketplace - Favorites</title>
      </Head>
      <Container maxW="2xl" display={'flex'} flexDirection={'column'}>
        <Box h="100vh">
          <Heading mt="1em">Favorites</Heading>
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.z
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default Favorites
