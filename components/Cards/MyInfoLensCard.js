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
const MyInfoLensCard = ({ dataProfile, /* balance, */ t }) => {

  let pictureLens = dataProfile && dataProfile.photo.split("/") || null;
  pictureLens = pictureLens[pictureLens.length - 1] ? "https://lens.infura-ipfs.io/ipfs/" + pictureLens[pictureLens.length - 1] : "";

  if (!dataProfile)
    return (
      <>
        <Text>No Data</Text>
      </>
    )

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
                src={pictureLens}
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
                {dataProfile.lens_info.name}
              </Heading>
              <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                {dataProfile.lens_info.handle}
              </Text>
            </Stack>
             <Flex flex={0.2} justifyContent="center" alignItems="center">
              {dataProfile && dataProfile.permission !== 6 && (
                <Link
                  href={"https://www.lensfrens.xyz/" + dataProfile.lens_info.handle
                  }
                  isExternal
                >
                  <Button bg="#00ABD1" color="white" _hover={{
                    bg: "blue.300"
                  }}>
                    {t("My Lens Profile")}
                  </Button>
                </Link>
              )}
            </Flex> 
          </Stack>
        </Center>
      </>
    )
}

export default MyInfoLensCard
