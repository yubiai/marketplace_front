import { Button, Center, Heading, Flex, Image, Stack, Text, Divider } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const MyInfoPrivateCard = ({ dataProfile, t }) => {
  const router = useRouter();
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

  if (!dataProfile) return <>No Data</>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={'full'}
          height={{ sm: 'full', md: '20rem' }}
          direction={{ base: 'column', md: 'row' }}
          bg={'white'}
          boxShadow={'2xl'}
          padding={4}
        >
          <Flex flex={0.4}>
            <Image
              alt="Photo perfil"
              objectFit="cover"
              boxSize="100%"
              borderRadius={'10px'}
              src={url_fleek + dataProfile.photo}
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
              {dataProfile.name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              {dataProfile.eth_address}
            </Text>
            {dataProfile.private_info && dataProfile.private_info.realname && (
              <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                Real Name: {dataProfile.private_info.realname}
              </Text>
            )}
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Address")}: </b>
              {dataProfile.private_info && (
                <>
                  {dataProfile.private_info.address || ""} - {dataProfile.private_info.city || ""} -{' '}
                  {dataProfile.private_info.country || ""}
                </>
              )}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Email")}</b> {' '}
              {dataProfile && dataProfile.private_info && dataProfile.private_info.email ? dataProfile.private_info.email : 'Empty'}
              <b> - {t("Telephone")}</b> {' '}
              {dataProfile && dataProfile.private_info && dataProfile.private_info.telephone
                ? dataProfile.private_info.telephone
                : 'Empty'}
            </Text>
          </Stack>
          <Flex flex={0.2} justifyContent="center" alignItems="center">
            <Button bg="#00ABD1" color="white" w="10em" _hover={{
              bg: "blue.300"
            }} onClick={() => router.push("/profile/edit")}>{t("Edit Profile")}</Button>
          </Flex>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard;
