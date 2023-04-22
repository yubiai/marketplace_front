import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Link
} from '@chakra-ui/react'
import moment from 'moment'
const MyInfoPohCard = ({ dataProfile, /* balance, */ t }) => {
  if (!dataProfile)
    return (
      <>
        <Text>No Data</Text>
      </>
    )

  console.log(dataProfile, "dataProfile")

  if (dataProfile)
    return (
      <>
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={'full'}
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
                src={process.env.NEXT_PUBLIC_IPFS_GATEWAY + dataProfile?.poh_info?.photo}
                fallbackSrc={"/static/images/userdefault.png"}
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
                {dataProfile?.poh_info?.first_name} {dataProfile?.poh_info?.last_name}
              </Heading>
              <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                {dataProfile?.eth_address}
              </Text>
              <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                {t("Registration date")}: {moment.unix(dataProfile?.poh_info?.registered_time).format('DD MMMM, YYYY h:mm:ss a')}
              </Text>
            </Stack>
            <Flex flex={0.2} justifyContent="center" alignItems="center">
              {dataProfile && dataProfile.permission !== 6 && (
                <Link
                  href={
                    'https://app.proofofhumanity.id/profile/' +
                    dataProfile.eth_address
                  }
                  isExternal
                >
                  <Button bg="#00ABD1" color="white" _hover={{
                    bg: "blue.300"
                  }}>
                    {t("My PoH Profile")}
                  </Button>
                </Link>
              )}
            </Flex>
          </Stack>
        </Center>
      </>
    )
}

export default MyInfoPohCard
