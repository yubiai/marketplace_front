import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  Divider,
} from '@chakra-ui/react'

const IMAGE =
  'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80'

const ItemCardLg = () => {
  return (
    <Center p={2}>
      <Box
        role={'group'}
        maxW={'262px'}
        w={'full'}
        maxH={'400px'}
        h={'378px'}
        bg={'white'}
        rounded={'lg'}
        pos={'relative'}
        _hover={{
          bg: 'gray.300',
        }}
      >
        <Image
          alt="Img Item"
          borderTopRadius="lg"
          height={'280px'}
          width={'262px'}
          objectFit={'cover'}
          src={IMAGE}
        />
        <Stack align={'left'} m="5px">
          <Divider />
          <Text
            color={'gray.600'}
            fontSize={'16px'}
            textTransform={'uppercase'}
          >
            Diseñador
          </Text>
          <Heading fontSize={'10px'} fontFamily={'body'} fontWeight={500}>
            Diseñador de Logos
          </Heading>
          <Stack direction={'row'}>
            <Text fontWeight={800} fontSize={'1ems'}>
              100
            </Text>
            <Text>DAI</Text>
            {/* <Text textDecoration={'line-through'} color={'red'}>
              $199
            </Text> */}
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

export default ItemCardLg
