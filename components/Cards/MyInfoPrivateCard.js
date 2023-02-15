import { Box, Button, Center, Divider, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const MyInfoPrivateCard = ({ dataProfile, t }) => {
  if (!dataProfile) return <>No Data</>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()

  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          width={'full'}
          height={'full'}
          direction={{ base: 'column', md: 'row' }}
          bg={'white'}
          boxShadow={'2xl'}
          padding={4}
        >
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="left"
            p={2}
            pt={2}
          >
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Real Name")}</b>{' '}
              {dataProfile && dataProfile.realname
                ? dataProfile.realname
                : 'Empty'}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Shipping address")}</b> {dataProfile.address} - {dataProfile.city} -{' '}
              {dataProfile.country}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Telephone")}</b> {' '}
              {dataProfile && dataProfile.telephone
                ? dataProfile.telephone
                : 'Empty'}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>{t("Email")}</b> {' '}
              {dataProfile && dataProfile.email ? dataProfile.email : 'Empty'}
            </Text>
            <Divider />
            <Box textAlign={"center"}>
              <Button bg="#00ABD1" color="white" w="10em" _hover={{
                bg: "blue.300"
              }} onClick={() => router.push("/profile/edit")}>{t("Edit Profile")}</Button>
            </Box>
          </Stack>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard
