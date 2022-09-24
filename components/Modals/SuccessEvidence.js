import { CheckCircleIcon } from '@chakra-ui/icons'
import { Box, Heading, Text } from '@chakra-ui/react'

const SuccessEvidence = () => {
  return (
    <>
      <Box textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
        <Heading as="h2" size="xl" mt={6} mb={2} color="#1c548b">
        Your evidence  has been submitted!
        </Heading>
      </Box>    
    </>
  )
}

export default SuccessEvidence
