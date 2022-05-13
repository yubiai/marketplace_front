import {
  Center,
  Divider,
  Stack,
  Text,
} from '@chakra-ui/react'

const MyInfoPrivateCard = () => {
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
              <b>Real Name:</b> Adsds Esdsds
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              <b>ID:</b> qweqwe2232
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            <b>Cellphone:</b> 23232232
            </Text>
            <Divider />
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            <b>Telegram:</b> 2323232
            </Text>
            <Divider />
          </Stack>

        </Stack>
      </Center>
    </>
  )
}

export default MyInfoPrivateCard
