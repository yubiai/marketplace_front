import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
const MyInfoPohCard = () => {
  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: '100%', md: '100%' }}
          height={{ sm: '476px', md: '10rem' }}
          direction={{ base: 'column', md: 'row' }}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          padding={4}
        >
          <Flex flex={0.2}>
            <Image
              alt="Photo perfil"
              objectFit="cover"
              boxSize="100%"
              borderRadius={'10px'}
              src={
                'https://ipfs.kleros.io/ipfs/QmRETAM6QAF5Foeqqxe7wZQhfjef6EbaLsSEaL2ZHZ11L5/foto-perfil-leandro-venezia-ver-2.jpg'
              }
            />
          </Flex>
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="left"
            p={1}
            pt={2}
          >
            <Heading fontSize={'2xl'} fontFamily={'body'}>
              Lea Vene
            </Heading>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              0x00000
            </Text>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              23232 ubis
            </Text>
          </Stack>
          <Flex flex={0.2} justifyContent="center" alignItems="center">
            <Button bg="#00ABD1" color="white">
              My PoH Profile
            </Button>
          </Flex>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPohCard
