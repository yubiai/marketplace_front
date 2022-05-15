import { Box, Center, Flex, Image } from '@chakra-ui/react'

const PreviewItem = () => {
  const IMAGE =
    'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80'

  return (
    <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
      <Box width={'full'}>
        <Center>
          <Image
            alt="Img Item"
            rounded={'lg'}
            height={'400px'}
            width={'full'}
            objectFit={'cover'}
            src={IMAGE}
          />
        </Center>
      </Box>
      <Box width={'full'}>
          
          Title

          Description
      </Box>
    </Flex>
  )
}

export default PreviewItem
