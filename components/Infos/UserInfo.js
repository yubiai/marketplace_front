import { Center, Flex, Image, Text, Stack, HStack, Box } from '@chakra-ui/react'


const UserInfo = ({profile, balanceToken}) => {


  if (profile){
    return (
      <HStack spacing="1em">
        <Box w="33%" h="60px">
          <Center>
            <Image
              alt={'Logo'}
              borderRadius="2xl"
              marginTop={'6px'}
              width={'3em'}
              objectFit={'cover'}
              src={profile.photo}
              fallbackSrc={profile.photo}
            />
          </Center>
        </Box>
        <Box w="66%" h="60px" p="5px">
          <Stack spacing={2}>
            <Text fontSize={'15px'}>{profile && profile.first_name + (" ") + profile.last_name} </Text>
            <Flex>
              <Image
                alt={'Logo'}
                width="0.8em"
                borderRadius="2xl"
                objectFit={'cover'}
                src={'/static/images/logoubi.png'}
                fallbackSrc={'/static/images/logoubi.png'}
              />
              <Text fontSize={'10px'} fontWeight="bold">
                {balanceToken} UBI dripped
              </Text>
            </Flex>
          </Stack>
        </Box>
      </HStack>
    )
  }
}

export default UserInfo
