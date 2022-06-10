import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Error({ error }) {
  return (
    <Box textAlign="center" py={10} px={6} h="100vh">
      <Box display="inline-block" mt="2em">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center"
        >
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {error}
      </Heading>
      <Link href="/">
        <Button
          backgroundColor={'#00abd1'}
          color={'white'}
          rounded={'full'}
          mt="1em"
          cursor={'pointer'}
        >
          Go to Home
        </Button>
      </Link>
    </Box>
  )
}
