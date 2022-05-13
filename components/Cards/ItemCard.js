import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Divider,
} from '@chakra-ui/react'

const IMAGE =
  'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80'

const ItemCard = () => {
  return (
    <Center p={4}>
      <Box
        role={'group'}
        p={2}
        maxW={'160px'}
        w={'full'}
        maxH={'218px'}
        h={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        rounded={'lg'}
        pos={'relative'}
      >
        <Image
          alt="Img Item"
          rounded={'lg'}
          height={100}
          width={80}
          objectFit={'cover'}
          src={IMAGE}
        />
        <Stack align={'left'} mt="1em">
        <Divider />
          <Text color={'gray.600'} fontSize={'sm'} textTransform={'uppercase'}>
            Diseñador
          </Text>
          <Heading fontSize={'10px'} fontFamily={'body'} fontWeight={500}>
            Diseñador de Logos
          </Heading>
          <Stack direction={'row'}>
            <Text fontWeight={800} fontSize={'1ems'}>
              $100 
            </Text>
            <Text>UBI</Text>
            {/* <Text textDecoration={'line-through'} color={'red'}>
              $199
            </Text> */}
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

export default ItemCard
