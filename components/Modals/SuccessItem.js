import { CheckCircleIcon } from '@chakra-ui/icons'
import { Box, Heading, Text } from '@chakra-ui/react'

const SuccessItem = () => {
  return (
    <>
      <Box textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
        <Heading as="h2" size="xl" mt={6} mb={2} color="#1c548b">
        Your listing has been submitted!
        </Heading>
        <Text color={'gray.500'}>
        Our team would review your listing and notify you via email once your listing is live. This usually takes 2 hours to review.
        </Text>
      </Box>    
    </>
  )
}

export default SuccessItem
