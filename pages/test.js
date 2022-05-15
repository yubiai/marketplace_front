import { Center, Text, Button, Box } from '@chakra-ui/react'
import ButtonYB from '../components/Buttons/ButtonYB'

const Test = () => {
  return (
    <>
      <Center bg="tomato" h="300px" color="white">
        Test
      </Center>
      <Text
        as="p"
        fontSize="lg"
        color={'peru.700'}
        align="justify"
        textStyle="test"
      >
        loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
      </Text>
      <Center m={'2em'}>
        <Button colorScheme="teal" size="md">
          Button
        </Button>
      </Center>
      <Center m={'2em'}>
        <Box
          as="button"
          height="24px"
          lineHeight="1.2"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          border="1px"
          px="9px"
          borderRadius="2px"
          fontSize="14px"
          fontWeight="semibold"
          bg="#f5f6f7"
          borderColor="#ccd0d5"
          color="#4b4f56"
          _hover={{ bg: '#ebedf0' }}
          _active={{
            bg: '#dddfe2',
            transform: 'scale(0.98)',
            borderColor: '#bec3c9',
          }}
          _focus={{
            boxShadow:
              '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
          }}
        >
          Join Group
        </Box>
      </Center>
      <Center m={'2em'}>
        <ButtonYB size="sm" variant="solid">
          ButtonYB
        </ButtonYB>
      </Center>
    </>
  )
}

export default Test
