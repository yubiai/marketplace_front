import { Center, Divider, Stack, Text } from '@chakra-ui/react'

const MyInfoPrivateCard = ({ dataProfile }) => {
  if (!dataProfile) return <>No Data</>

  return (
    <>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: '100%', md: '100%' }}
          height={{ base: 'full', sm: '476px', md: '10rem' }}
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
          </Stack>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard
