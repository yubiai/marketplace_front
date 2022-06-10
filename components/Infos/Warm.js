import { WarningTwoIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'

const Warm = ({ message }) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {message || 'Not result'}
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

export default Warm
