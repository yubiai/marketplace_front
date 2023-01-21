import { Center, Container, Spinner } from '@chakra-ui/react'

const styles = {
  checkout: {
    position: 'absolute',
    left: 0,
    background: 'rgba(42, 42, 42, 0.2)',
    zIndex: 1,
    height: '90%'
  }
};

const spinnerStyles = {
  checkout: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: 0
  }
};

const Loading = ({ styleType }) => {
  const myStyles = styles[styleType];
  const spinnerStyleImp = spinnerStyles[styleType];

  return (
    <Container style={myStyles || null} maxW='100%' h='90vh'>
      <Center mt="5em" style={spinnerStyleImp || null}>
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
