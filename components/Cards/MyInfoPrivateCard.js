import { Center, Divider, Stack, Text } from '@chakra-ui/react'

const MyInfoPrivateCard = ({ dataProfile }) => {

  if(!dataProfile.realname && !dataProfile.address && !dataProfile.city && !dataProfile.country && !dataProfile.telephone && !dataProfile.email) return (
    <>
    No Data
    </>
  )

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
            {dataProfile && dataProfile.realname && (
              <>
                <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                  <b>Real Name:</b> {dataProfile.realname}
                </Text>
                <Divider />
              </>
            )}
            {dataProfile &&
              dataProfile.address &&
              dataProfile.city &&
              dataProfile.country && (
                <>
                  <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                    <b>Ubication:</b> {dataProfile.address} - {dataProfile.city}{' '}
                    - {dataProfile.country}
                  </Text>
                  <Divider />
                </>
              )}
            {dataProfile && dataProfile.telephone && (
              <>
                <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                  <b>Telephone:</b> {dataProfile.telephone}
                </Text>
                <Divider />
              </>
            )}
            {dataProfile && dataProfile.email && (
              <>
                <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                  <b>Email:</b> {dataProfile.email}
                </Text>
                <Divider />
              </>
            )}
          </Stack>
        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard
