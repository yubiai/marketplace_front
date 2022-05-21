import { Center, Container, Spinner } from '@chakra-ui/react'

const Loading = () => {
  return (
    <Container maxW='container.xl' h='100vh'>
      <Center mt="5em">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    </Container>
  )
}

export default Loading
