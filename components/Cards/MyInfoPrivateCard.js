import { Button, Center, Divider, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const MyInfoPrivateCard = ({ dataProfile }) => {
  if (!dataProfile) return <>No Data</>
  const router = useRouter()

  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          width={{ base: '100%', sm: '100%', md: '100%' }}
          height={{ base: 'full', sm: 'full', md: '50%' }}
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
              <b>Real Name:</b>{' '}
              {dataProfile && dataProfile.realname
                ? dataProfile.realname
                : 'Empty'}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>Ubication:</b> {dataProfile.address} - {dataProfile.city} -{' '}
              {dataProfile.country}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>Telephone:</b>{' '}
              {dataProfile && dataProfile.telephone
                ? dataProfile.telephone
                : 'Empty'}
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>Email:</b>{' '}
              {dataProfile && dataProfile.email ? dataProfile.email : 'Empty'}
            </Text>
            <Divider />
            <Button bg="#00ABD1" color="white" w="10em" onClick={() => router.push("/profile/edit")}>Edit Profile</Button>
          </Stack>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard
