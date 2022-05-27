import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
const MyInfoPohCard = ({dataProfile, balance}) => {

  if(!dataProfile) return (
    <>
      <Text>No Data</Text>
    </>
  )

  if(dataProfile) return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: '100%', md: '100%' }}
          height={{ sm: 'full', md: '10rem' }}
          direction={{ base: 'column', md: 'row' }}
          bg={'white'}
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
                dataProfile.photo
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
              {dataProfile.first_name} {dataProfile.last_name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            {dataProfile.eth_address}
            </Text>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              {balance} ubis
            </Text>
          </Stack>
          <Flex flex={0.2} justifyContent="center" alignItems="center">
            <Link href={'https://app.proofofhumanity.id/profile/' + dataProfile.eth_address} isExternal>
            <Button bg="#00ABD1" color="white">
              My PoH Profile
            </Button>
            </Link>
          </Flex>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPohCard
